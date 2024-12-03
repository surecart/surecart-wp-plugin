<?php

namespace SureCart\Models;

use ArrayAccess;
use JsonSerializable;
use SureCart\Concerns\Arrayable;
use SureCart\Models\Concerns\Facade;

/**
 * Static File Model class
 */
abstract class StaticFileModel implements ArrayAccess, JsonSerializable, Arrayable, ModelInterface {
	use Facade;

	/**
	 * Keeps track of booted models
	 *
	 * @var array
	 */
	protected static $booted = [];

	/**
	 * Keeps track of model events
	 *
	 * @var array
	 */
	protected static $events = [];

	/**
	 * Stores model attributes
	 *
	 * @var array
	 */
	protected $attributes = [];

	/**
	 * Original attributes for dirty handling
	 *
	 * @var array
	 */
	protected $original = [];

	/**
	 * Query arguments
	 *
	 * @var array
	 */
	protected $query = [];

	/**
	 * Stores model relations
	 *
	 * @var array
	 */
	protected $relations = [];

	/**
	 * Fillable model items
	 *
	 * @var array
	 */
	protected $fillable = [ '*' ];

	/**
	 * Guarded model items
	 *
	 * @var array
	 */
	protected $guarded = [];

	/**
	 * Static data from file
	 *
	 * @var array
	 */
	protected static $data = [];

	/**
	 * Path to the static data file
	 *
	 * @var string
	 */
	protected $directory = '';

	/**
	 * Model constructor
	 *
	 * @param array $attributes Optional attributes.
	 */
	public function __construct( $attributes = [] ) {
		if ( is_string( $attributes ) ) {
			$attributes = [ 'id' => $attributes ];
		}

		$this->bootModel();
		$this->loadStaticData();
		$this->syncOriginal();
		$this->fill( $attributes );
	}

	/**
	 * Load static data from directory.
	 */
	protected function loadStaticData() {
		if ( empty( static::$data ) ) {

			$files = array_filter(
				glob( $this->directory . '/*.php' ),
				function ( $file ) {
					// Skip abstract classes (prefixed with Abstract).
					return strpos( basename( $file ), 'Abstract' ) === false;
				}
			);

			// Loop through each file and instantiate the class.
			foreach ( $files as $file ) {
				// Get the filename without extension.
				$class_name = basename( $file, '.php' );

				// Get namespace from directory path.
				$relative_path = str_replace(
					[ dirname( dirname( $this->directory ) ), '/' ],
					[ '', '\\' ],
					dirname( $file )
				);
				$namespace     = 'SureCart' . $relative_path;

				// Build the full class name with namespace.
				$full_class_name = $namespace . '\\' . $class_name;

				if ( class_exists( $full_class_name ) ) {
					// Store the instance data using getId() as the key.
					static::$data[] = new $full_class_name();
				}
			}
		}
	}

	/**
	 * Get the query results
	 *
	 * @return array
	 */
	protected function executeQuery() {
		$data = static::$data;

		// Apply limit and offset.
		if ( isset( $this->query['limit'] ) ) {
			$data = array_slice( $data, $this->query['offset'] ?? 0, $this->query['limit'] );
		}

		return $data;
	}

	/**
	 * Find a specific model with an id
	 *
	 * @param string $id Id of the model.
	 * @return $this|\WP_Error
	 */
	protected function find( $id = '' ) {
		if ( $this->fireModelEvent( 'finding' ) === false ) {
			return false;
		}

		$result = array_filter(
			static::$data,
			function ( $item ) use ( $id ) {
				return $item['id'] === $id;
			}
		);

		if ( empty( $result ) ) {
			return new \WP_Error( 'not_found', 'This does not exist.' );
		}

		$attributes = reset( $result );

		$this->fireModelEvent( 'found' );
		$this->syncOriginal();
		$this->fill( $attributes );

		return $this;
	}

	/**
	 * Get all items matching the current query
	 *
	 * @return array
	 */
	protected function get() {
		$data = static::$data;

		// Apply limit and offset.
		if ( isset( $this->query['limit'] ) ) {
			$data = array_slice( $data, $this->query['offset'] ?? 0, $this->query['limit'] );
		}

		return $data;
	}

	/**
	 * Sync the original attributes with the current
	 *
	 * @return $this
	 */
	protected function syncOriginal() {
		$this->original = $this->attributes;
		return $this;
	}

	/**
	 * Boot the model if not already booted
	 *
	 * @return void
	 */
	protected function bootModel() {
		$class = $this->getCalledClassName();
		if ( ! isset( static::$booted[ $class ] ) ) {
			static::$booted[ $class ] = true;
			static::boot();
		}
	}

	/**
	 * The "boot" method of the model.
	 *
	 * @return void
	 */
	protected static function boot() {
		// Override in child classes if needed
	}

	/**
	 * Get the called class name
	 *
	 * @return string
	 */
	protected function getCalledClassName() {
		return get_called_class();
	}

	/**
	 * Fill the model with an array of attributes.
	 *
	 * @param array $attributes Attributes to fill.
	 * @return $this
	 */
	public function fill( $attributes ) {
		foreach ( $attributes as $key => $value ) {
			if ( $this->isFillable( $key ) ) {
				$this->setAttribute( $key, $value );
			}
		}
		return $this;
	}

	/**
	 * Determine if the given attribute may be mass assigned.
	 *
	 * @param string $key Attribute key.
	 * @return bool
	 */
	public function isFillable( $key ) {
		if ( in_array( $key, $this->guarded, true ) ) {
			return false;
		}
		return $this->fillable === [ '*' ] || in_array( $key, $this->fillable, true );
	}

	/**
	 * Set a given attribute on the model.
	 *
	 * @param string $key   Attribute key.
	 * @param mixed  $value Attribute value.
	 * @return mixed
	 */
	public function setAttribute( $key, $value ) {
		$this->attributes[ $key ] = $value;
		return $this;
	}

	/**
	 * Get an attribute from the model.
	 *
	 * @param string $key Attribute key.
	 * @return mixed
	 */
	public function getAttribute( $key ) {
		return $this->attributes[ $key ] ?? null;
	}

	/**
	 * Fire the given event for the model.
	 *
	 * @param string $event Event name.
	 * @return mixed
	 */
	protected function fireModelEvent( $event ) {
		if ( ! isset( static::$events[ $event ] ) ) {
			return true;
		}

		foreach ( static::$events[ $event ] as $callback ) {
			if ( is_callable( $callback ) ) {
				$result = call_user_func( $callback, $this );
				if ( false === $result ) {
					return false;
				}
			}
		}

		return true;
	}

	/**
	 * ArrayAccess implementation
	 */
	public function offsetExists( $offset ): bool {
		return isset( $this->attributes[ $offset ] );
	}

	public function offsetGet( $offset ): mixed {
		return $this->getAttribute( $offset );
	}

	public function offsetSet( $offset, $value ): void {
		$this->setAttribute( $offset, $value );
	}

	public function offsetUnset( $offset ): void {
		unset( $this->attributes[ $offset ] );
	}

	/**
	 * JsonSerializable implementation
	 */
	public function jsonSerialize(): mixed {
		return $this->toArray();
	}

	/**
	 * Get the instance as an array.
	 *
	 * @return array
	 */
	public function toArray() {
		return $this->attributes;
	}
}

<?php

namespace SureCart\Models;

use ArrayAccess;
use JsonSerializable;
use SureCart\Concerns\Arrayable;
use SureCart\Models\Concerns\Facade;

/**
 * External API Model class
 */
abstract class ExternalApiModel implements ArrayAccess, JsonSerializable, Arrayable, ModelInterface {
	use Facade;

	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = '';

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
	 * Default query parameters
	 *
	 * @var array
	 */
	protected $default_query = [];

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
	 * Path to the static data file
	 *
	 * @var string
	 */
	protected $base_url = '';

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
		$this->syncOriginal();
		$this->fill( $attributes );
	}

	/**
	 * Find a specific model with an id.
	 *
	 * @param string $id Id of the model.
	 *
	 * @return $this|\WP_Error
	 */
	protected function find( $id = '' ) {
		if ( $this->fireModelEvent( 'finding' ) === false ) {
			return false;
		}

		$result = $this->makeRequest( [ 'id' => $id ] );

		if ( is_wp_error( $result ) ) {
			return new $result->get_error_message();
		}

		$attributes = json_decode( wp_remote_retrieve_body( $result ), true );

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
		$result = $this->makeRequest();

		if ( is_wp_error( $result ) ) {
			return $result->get_error_message();
		}

		$result = json_decode( wp_remote_retrieve_body( $result ), true );

		foreach ( $result as $key => $item ) {
			$result[ $key ] = new static( $item );
		}

		return $result;
	}

	/**
	 * Make a request to the API.
	 *
	 * @param array $args Array of arguments.
	 *
	 * @return array|WP_Error
	 */
	protected function makeRequest( $args = [] ) {
		$endpoint = ! empty( $args['id'] ) ? $this->endpoint . '/' . $args['id'] : $this->endpoint;
		$url      = add_query_arg(
			array_merge( $this->default_query, $this->query ),
			$this->base_url . $endpoint
		);

		// Create a unique transient key based on the URL.
		$transient_key = 'sc_remote_request_' . md5( $url );

		// Try to get cached response from transient.
		$cached_response = get_transient( $transient_key );
		if ( false !== $cached_response ) {
			return $cached_response;
		}

		// Make the request if no cache exists in transient.
		$response = wp_remote_get(
			$url,
			[
				'timeout' => 20,
			]
		);

		// Cache successful responses for 24 hours.
		if ( ! is_wp_error( $response ) && 200 === wp_remote_retrieve_response_code( $response ) ) {
			set_transient( $transient_key, $response, DAY_IN_SECONDS );
		}

		return $response;
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
	 * Calls a mutator based on set{Attribute}Attribute
	 *
	 * @param string $key Attribute key.
	 * @param mixed  $type 'get' or 'set'.
	 *
	 * @return string|false
	 */
	public function getMutator( $key, $type ) {
		$key = ucwords( str_replace( [ '-', '_' ], ' ', $key ) );

		$method = $type . str_replace( ' ', '', $key ) . 'Attribute';

		if ( method_exists( $this, $method ) ) {
			return $method;
		}

		return false;
	}

	/**
	 * Check if the attribute exists.
	 *
	 * @param string $key Attribute key.
	 * @return bool
	 */
	public function hasAttribute( $key ) {
		return isset( $this->attributes[ $key ] );
	}

	/**
	 * Get an attribute from the model.
	 *
	 * @param string $key Attribute key.
	 * @return mixed
	 */
	public function getAttribute( $key ) {
		$attribute = null;

		if ( $this->hasAttribute( $key ) ) {
			$attribute = $this->attributes[ $key ];
		}

		$getter = $this->getMutator( $key, 'get' );

		if ( $getter ) {
			return $this->{$getter}( $attribute );
		} elseif ( ! is_null( $attribute ) ) {
			return $attribute;
		}
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
	 * Check if offset exists.
	 *
	 * @param mixed $offset Array offset.
	 * @return bool
	 */
	public function offsetExists( $offset ): bool {
		return isset( $this->attributes[ $offset ] );
	}

	/**
	 * Get offset value.
	 *
	 * @param mixed $offset Array offset.
	 * @return mixed
	 */
	public function offsetGet( $offset ): mixed {
		return $this->getAttribute( $offset );
	}

	/**
	 * Set offset value.
	 *
	 * @param mixed $offset Array offset.
	 * @param mixed $value  Offset value.
	 * @return void
	 */
	public function offsetSet( $offset, $value ): void {
		$this->setAttribute( $offset, $value );
	}

	/**
	 * Unset offset.
	 *
	 * @param mixed $offset Array offset.
	 * @return void
	 */
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
	 * Get the model attributes
	 *
	 * @return array
	 */
	public function getAttributes() {
		return json_decode( wp_json_encode( $this->attributes ), true );
	}

	/**
	 * Get the instance as an array.
	 *
	 * @return array
	 */
	public function toArray() {
		$attributes = $this->getAttributes();

		// hoist up the acf attributes to the top level.
		$acf        = $this->attributes['acf'];
		$attributes = array_merge( $acf, $attributes );

		// Check if any accessor is available and call it.
		foreach ( get_class_methods( $this ) as $method ) {
			if ( 'get' === substr( $method, 0, 3 ) && 'Attribute' === substr( $method, -9 ) ) {
				$key = str_replace( [ 'get', 'Attribute' ], '', $method );
				if ( $key ) {
					$pieces             = preg_split( '/(?=[A-Z])/', $key );
					$pieces             = array_map( 'strtolower', array_filter( $pieces ) );
					$key                = implode( '_', $pieces );
					$value              = array_key_exists( $key, $this->attributes ) ? $this->attributes[ $key ] : null;
					$attributes[ $key ] = $this->{$method}( $value );
				}
			}
		}

		// Check if any attribute is a model and call toArray.
		array_walk_recursive(
			$attributes,
			function ( &$value ) {
				if ( is_a( $value, Arrayable::class ) ) {
					$value = $value->toArray();
				}
			}
		);

		return $attributes;
	}

	/**
	 * Get the attribute
	 *
	 * @param string $key Attribute name.
	 *
	 * @return mixed
	 */
	public function __get( $key ) {
		return $this->getAttribute( $key );
	}
}

<?php

namespace SureCart\Integrations\Catalog;

use ArrayAccess;
use JsonSerializable;
use SureCart\Concerns\Arrayable;
use SureCart\Concerns\Objectable;

/**
 * Catalog item.
 */
abstract class AbstractCatalogItem implements ArrayAccess, JsonSerializable, Arrayable, Objectable {
	/**
	 * Stores model attributes
	 *
	 * @var array
	 */
	protected $attributes = [];

	/**
	 * The priority.
	 */
	public function getPriority() {
		return 10;
	}

	/**
	 * Get the plugin slug for the integration.
	 *
	 * @return string
	 */
	public function getPluginSlug() {
		return '';
	}

	/**
	 * Get the plugin file name for the integration.
	 *
	 * @return string
	 */
	public function getPluginFileName() {
		return '';
	}

	/**
	 * Get the documentation link for the integration.
	 *
	 * @return string
	 */
	public function getDocsLink() {
		return '';
	}

	/**
	 * Get the website link for the integration.
	 *
	 * @return string
	 */
	public function getWebsiteLink() {
		return '';
	}

	/**
	 * Get the support link for the integration.
	 *
	 * @return string
	 */
	public function getSupportLink() {
		return '';
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
	 * Calls accessors during toArray.
	 *
	 * @return array
	 */
	public function toArray() {
		$attributes = $this->getAttributes();
		// Check if any accessor is available and call it.
		foreach ( get_class_methods( $this ) as $method ) {
			if ( 'get' === substr( $method, 0, 3 ) ) {
				$key = str_replace( [ 'get' ], '', $method );
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
	 * Convert to object.
	 *
	 * @return Object
	 */
	public function toObject() {
		$attributes = (object) $this->attributes;

		// Check if any accessor is available and call it.
		foreach ( get_class_methods( $this ) as $method ) {
			if ( method_exists( get_class(), $method ) ) {
				continue;
			}

			if ( 'get' === substr( $method, 0, 3 ) ) {
				$key = str_replace( [ 'get' ], '', $method );
				if ( $key ) {
					$pieces           = preg_split( '/(?=[A-Z])/', $key );
					$pieces           = array_map( 'strtolower', array_filter( $pieces ) );
					$key              = implode( '_', $pieces );
					$value            = array_key_exists( $key, $this->attributes ) ? $this->attributes[ $key ] : null;
					$attributes->$key = $this->{$method}( $value );
				}
			}
		}

		// Check if any attribute is a model and call toArray.
		array_walk_recursive(
			$attributes,
			function ( &$value ) {
				if ( is_a( $value, Objectable::class ) ) {
					$value = $value->toObject();
				}
			}
		);

		return $attributes;
	}

	/**
	 * Is the plugin installed?
	 *
	 * @return boolean
	 */
	public function getIsPluginInstalled() {
		if ( ! function_exists( 'get_plugins' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}
		if ( empty( $this->getPluginFileName() ) ) {
			return false;
		}
		$all_plugins = get_plugins();
		return isset( $all_plugins[ $this->getPluginFileName() ] );
	}

	/**
	 * Is the integration enabled?
	 *
	 * @return boolean
	 */
	public function getIsEnabled() {
		return false;
	}

	/**
	 * Is the integration pre-installed?
	 *
	 * @return boolean
	 */
	public function getIsPreInstalled() {
		return false;
	}

	/**
	 * Serialize to json.
	 *
	 * @return array
	 */
	#[\ReturnTypeWillChange]
	public function jsonSerialize() {
		return $this->toArray();
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

	/**
	 * Set the attribute
	 *
	 * @param string $key Attribute name.
	 * @param mixed  $value Value of attribute.
	 *
	 * @return void
	 */
	public function __set( $key, $value ) {
		$this->setAttribute( $key, $value );
	}

	/**
	 * Determine if the given attribute exists.
	 *
	 * @param  mixed $offset Name.
	 * @return bool
	 */
	public function offsetExists( $offset ): bool {
		return ! is_null( $this->getAttribute( $offset ) );
	}

	/**
	 * Get the value for a given offset.
	 *
	 * @param  mixed $offset Name.
	 * @return mixed
	 */
	#[\ReturnTypeWillChange]
	public function offsetGet( $offset ) {
		return $this->getAttribute( $offset );
	}

	/**
	 * Set the value for a given offset.
	 *
	 * @param  mixed $offset Name.
	 * @param  mixed $value Value.
	 * @return void
	 */
	public function offsetSet( $offset, $value ): void {
		$this->setAttribute( $offset, $value );
	}

	/**
	 * Unset the value for a given offset.
	 *
	 * @param  mixed $offset Name.
	 * @return void
	 */
	public function offsetUnset( $offset ): void {
		unset( $this->attributes[ $offset ], $this->relations[ $offset ] );
	}

	/**
	 * Determine if an attribute or relation exists on the model.
	 *
	 * @param  string $key Name.
	 * @return bool
	 */
	public function __isset( $key ) {
		return $this->offsetExists( $key );
	}

	/**
	 * Unset an attribute on the model.
	 *
	 * @param  string $key Name.
	 * @return void
	 */
	public function __unset( $key ) {
		$this->offsetUnset( $key );
	}

	/**
	 * Forward call to method
	 *
	 * @param string $method Method to call.
	 * @param mixed  $params Method params.
	 */
	public function __call( $method, $params ) {
		return call_user_func_array( [ $this, $method ], $params );
	}

	/**
	 * Static Facade Accessor
	 *
	 * @param string $method Method to call.
	 * @param mixed  $params Method params.
	 *
	 * @return mixed
	 */
	public static function __callStatic( $method, $params ) {
		return call_user_func_array( [ new static(), $method ], $params );
	}
}

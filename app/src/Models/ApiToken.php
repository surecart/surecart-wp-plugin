<?php

namespace CheckoutEngine\Models;

use CheckoutEngine\Support\Encryption;

/**
 * The API token model.
 */
class ApiToken {

	/**
	 * The option key.
	 *
	 * @var string
	 */
	protected $key = 'ce_api_token';

	/**
	 * Save and encrypt the API token.
	 *
	 * @param string $value The API token.
	 * @return bool True if the value was updated, false otherwise.
	 */
	protected function save( $value ) {
		return update_option( $this->key, Encryption::encrypt( $value ) );
	}

	/**
	 * Get and decrypt the API token
	 *
	 * @return string The decoded API token.
	 */
	protected function get() {
		return Encryption::decrypt( get_option( $this->key, '' ) );
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

<?php

namespace SureCart\Models;

use SureCart\Support\Encryption;

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
	 * Reference for the salt.
	 *
	 * @var string
	 */
	protected $salt_ref_key = 'ce_salt_ref';

	/**
	 * Save and encrypt the API token.
	 *
	 * @param string $value The API token.
	 * @return bool True if the value was updated, false otherwise.
	 */
	protected function save( $value ) {
		$updated = update_option( $this->key, Encryption::encrypt( $value ) );
		// save the encryption salt reference when the token is updated.
		if ( $updated ) {
			$this->saveSaltEnd();
		}
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
	 * Save just the last 6 characters of the salt used to notify
	 * the user if it's been changed.
	 */
	protected function saveSaltEnd() {
		$key      = Encryption::getDefaultKey();
		$just_end = substr( $key, -6 );
		return update_option( $this->salt_ref_key, $just_end );
	}

	/**
	 * Get a refernce to the salt used to encrypt the API token.
	 *
	 * @return string The salt end.
	 */
	protected function getSaltRef() {
		return get_option( $this->salt_ref_key, '' );
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

<?php

namespace SureCart\WordPress;

use SureCart\Support\Encryption;

/**
 * Google Map Api Service.
 */
class GoogleMapApiService {
	/**
	 * Google Map API Key Option Name.
	 */
	public const API_KEY_OPTION_NAME = 'surecart_google_map_api_key';

	/**
	 * Google Map Enabled Option Name.
	 */
	public const API_KEY_ENABLED_OPTION_NAME = 'surecart_google_map_api_key_enabled';

	/**
	 * Register settings.
	 */
	public function bootstrap() {
		add_filter( 'pre_update_option_' . self::API_KEY_OPTION_NAME, [ $this, 'encryptSettings' ], 10, 3 );
		add_filter( 'option_' . self::API_KEY_OPTION_NAME, [ $this, 'decryptSettings' ], 10 );
	}

	/**
	 * Encrypt the Google Map API key before saving it to the database.
	 *
	 * @param mixed  $value     New value.
	 * @param mixed  $old_value Old value.
	 * @param string $option    Option name.
	 *
	 * @return string
	 */
	public function encryptSettings( $value, $old_value, $option ) {
		if ( empty( $value ) ) {
			return $value;
		}

		$encrypted = Encryption::encrypt( $value );
		if ( is_wp_error( $encrypted ) ) {
			return $old_value;
		}

		return $encrypted;
	}

	/**
	 * Decrypt the Google Map API key before returning it.
	 *
	 * @param mixed $value  Value.
	 *
	 * @return string
	 */
	public function decryptSettings( $value ) {
		if ( empty( $value ) || is_wp_error( $value ) ) {
			return '';
		}

		$decrypted_value = Encryption::decrypt( $value );
		if ( empty( $decrypted_value ) || is_wp_error( $decrypted_value ) ) {
			return '';
		}

		return $decrypted_value;
	}

	/**
	 * Is Google Map Enabled?
	 *
	 * @return boolean
	 */
	public function isEnabled() {
		return (bool) get_option( self::API_KEY_ENABLED_OPTION_NAME, false );
	}

	/**
	 * Get Google Map API key.
	 *
	 * @return string
	 */
	public function getApiKey() {
		// If not enabled, return.
		if ( ! $this->isEnabled() ) {
			return '';
		}

		return get_option( self::API_KEY_OPTION_NAME, '' );
	}
}

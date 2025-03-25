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
		add_filter( 'option_' . self::API_KEY_OPTION_NAME, [ $this, 'decryptSettings' ], 10, 2 );
	}

	/**
	 * Encrypt the Google Map API key before saving it to the database.
	 *
	 * @param mixed  $value    New value.
	 * @param mixed  $old_value Old value.
	 * @param string $option   Option name.
	 *
	 * @return string|\WP_Error
	 */
	public function encryptSettings( $value, $old_value, $option ) {
		if ( empty( $option ) ) {
			return $value;
		}

		$validated = $this->validate( $value );
		if ( is_wp_error( $validated ) ) {
			return new \WP_Error( 'invalid_google_map_api_key', $validated->get_error_message() );
		}

		return Encryption::encrypt( $value );
	}

	/**
	 * Decrypt the Google Map API key before returning it.
	 *
	 * @param mixed  $value  Value.
	 * @param string $option Option name.
	 *
	 * @return string|\WP_Error
	 */
	public function decryptSettings( $value, $option ) {
		if ( empty( $value ) || is_wp_error( $value ) ) {
			return '';
		}

		$decrypted_value = Encryption::decrypt( $value );
		if ( empty( $decrypted_value ) ) {
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

	/**
	 * Get Google Map api request.
	 *
	 * @param string $api_key google map api key.
	 * @return object
	 */
	public function makeRequest( $api_key ) {
		$google_map_url      = 'https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=' . $api_key;
		$google_map_response = wp_remote_get( $google_map_url );
		$google_map_body     = wp_remote_retrieve_body( $google_map_response );
		return json_decode( $google_map_body );
	}

	/**
	 * Validate the Google Map API key.
	 *
	 * @param string $api_key Google Map API key.
	 *
	 * @return true|\WP_Error
	 */
	public function validate( $api_key ) {
		// If the API key is empty, just pass it as valid.
		if ( empty( $api_key ) ) {
			return true;
		}

		$response = $this->makeRequest( $api_key );

		// Check if the response is valid.
		if ( isset( $response->status ) && 'OK' !== $response->status ) {
			return new \WP_Error( 'google_map_api_key_invalid', $response->error_message ?? __( 'Invalid Google Map API key.', 'surecart' ) );
		}

		return true;
	}
}

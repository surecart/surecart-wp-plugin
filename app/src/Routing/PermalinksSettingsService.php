<?php

namespace SureCart\Routing;

/**
 * Permalinks settings service.
 * Handles fetching, saving and updating permalink settings.
 */
class PermalinksSettingsService {
	/**
	 * Permalink settings.
	 *
	 * @var array
	 */
	private $permalinks = [];

	/**
	 * Get the current values of the permalinks.
	 */
	public function __construct() {
		$this->permalinks = $this->getSettings();
	}

	/**
	 * Get the permalink settings.
	 *
	 * @return array
	 */
	public function getSettings() {
		$settings = (array) get_option( 'surecart_permalinks', [] );
		return wp_parse_args(
			$settings,
			[
				'buy_page'        => 'buy',
				'product_page'    => 'products',
				'collection_page' => 'collections',
				'upsell_page'     => 'offer',
			]
		);
	}

	/**
	 * Update the permalink settings.
	 *
	 * @param string $key   The key to update.
	 * @param array  $value The value to update.
	 *
	 * @return bool
	 */
	public function updatePermalinkSettings( $key, $value ) {
		$this->permalinks[ $key ] = $this->sanitize( $value );
		return update_option( 'surecart_permalinks', $this->permalinks );
	}

	/**
	 * Sanitize the permalink.
	 *
	 * @param string $value The value to sanitize.
	 *
	 * @return string
	 */
	public function sanitize( $value ): string {
		global $wpdb;

		$value = $wpdb->strip_invalid_text_for_column( $wpdb->options, 'option_value', $value ?? '' );

		if ( is_wp_error( $value ) ) {
			$value = '';
		}

		$value = sanitize_url( trim( $value ) );
		$value = str_replace( 'http://', '', $value );
		$value = str_replace( 'https://', '', $value );
		$value = ltrim( $value, '/' );
		return untrailingslashit( $value );
	}


	/**
	 * Get get the base for a slug.
	 *
	 * @param string $slug The slug of the base.
	 *
	 * @return string
	 */
	public function getBase( $slug ) {
		return $this->permalinks[ $slug ] ?? '';
	}
}

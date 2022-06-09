<?php

namespace SureCart\Controllers\Admin\Settings;

use SureCart\Support\Currency;

/**
 * Controls the settings page.
 */
abstract class BaseSettings {
	public function enqueue( $handle, $path, $deps = [] ) {
		$deps = array_merge( $deps, [ 'sc-ui-data' ] );

		wp_enqueue_media();
		wp_enqueue_style( 'wp-components' );
		wp_enqueue_style( 'surecart-themes-default' );
		wp_enqueue_script( 'surecart-components' );

		// automatically load dependencies and version.
		$asset_file = include plugin_dir_path( SURECART_PLUGIN_FILE ) . "dist/$path.asset.php";

		// Enqueue scripts.
		\SureCart::core()->assets()->enqueueScript(
			$handle,
			trailingslashit( \SureCart::core()->assets()->getUrl() ) . "dist/$path.js",
			array_merge( $asset_file['dependencies'], $deps ),
			$asset_file['version']
		);

		wp_set_script_translations( $handle, 'surecart', WP_LANG_DIR . '/plugins/' );

		wp_localize_script(
			$handle,
			'scData',
			[ 'supported_currencies' => Currency::getSupportedCurrencies() ]
		);
	}
}

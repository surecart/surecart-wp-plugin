<?php

namespace SureCart\Support\Scripts;

use SureCart\Models\Account;
use SureCart\Support\Currency;

/**
 * Class for model edit pages to extend.
 */
abstract class AdminModelEditController {
	/**
	 * Script path.
	 *
	 * @var string
	 */
	protected $path = '';

	/**
	 * Script handle.
	 *
	 * @var string
	 */
	protected $handle = '';

	/**
	 * What types of data to add the the page.
	 *
	 * @var array
	 */
	protected $with_data = [ 'links' ];

	/**
	 * Additional dependencies
	 *
	 * @var array
	 */
	protected $dependencies = [ 'sc-core-data', 'sc-ui-data' ];

	/**
	 * Data to pass to the page.
	 *
	 * @var array
	 */
	protected $data = [];

	/**
	 * Optional conditionally load.
	 */
	protected function condition() {
		return true;
	}

	/**
	 * Enqueue needed scripts
	 *
	 * @return void
	 */
	public function enqueueScriptDependencies() {
		wp_enqueue_media();
		wp_enqueue_style( 'wp-components' );
	}

	public function enqueueComponents() {
		wp_enqueue_script( 'surecart-components' );
		wp_enqueue_style( 'surecart-themes-default' );
	}

	/**
	 * Enqueue scripts
	 *
	 * @return void
	 */
	public function enqueue() {
		if ( ! $this->condition() ) {
			return;
		}

		// components are also used on index pages.
		$this->enqueueComponents();

		// match url query for the scripts.
		if ( ! empty( $this->url_query ) ) {
			foreach ( $this->url_query as $param => $value ) {
				// phpcs:ignore
				if ( ! isset( $_GET[ $param ] ) || $value !== $_GET[ $param ] ) {
					return;
				}
			}
		}

		// enqueue dependencies.
		$this->enqueueScriptDependencies();

		// automatically load dependencies and version
		$asset_file = include plugin_dir_path( SURECART_PLUGIN_FILE ) . "dist/$this->path.asset.php";

		// Enqueue scripts.
		\SureCart::core()->assets()->enqueueScript(
			$this->handle,
			trailingslashit( \SureCart::core()->assets()->getUrl() ) . "dist/$this->path.js",
			array_merge( $asset_file['dependencies'], $this->dependencies ),
			$asset_file['version']
		);

		// pass app url.
		$this->data['surecart_app_url'] = defined( 'SURECART_APP_URL' ) ? SURECART_APP_URL : '';
		$this->data['plugin_url']       = \SureCart::core()->assets()->getUrl();

		if ( in_array( 'currency', $this->with_data ) ) {
			$this->data['currency_code'] = \SureCart::account()->currency;
		}
		if ( in_array( 'tax_protocol', $this->with_data ) ) {
			$this->data['tax_protocol'] = \SureCart::account()->tax_protocol;
		}
		if ( in_array( 'checkout_page_url', $this->with_data ) ) {
			$this->data['checkout_page_url'] = \SureCart::getUrl()->checkout();
		}
		if ( in_array( 'supported_currencies', $this->with_data ) ) {
			$this->data['supported_currencies'] = Currency::getSupportedCurrencies();
		}
		if ( in_array( 'links', $this->with_data ) ) {
			$this->data['links'] = [];
			foreach ( array_keys( \SureCart::getAdminPageNames() ) as $name ) {
				$this->data['links'][ $name ] = esc_url_raw( add_query_arg( [ 'action' => 'edit' ], \SureCart::getUrl()->index( $name ) ) );
			}
		}

		wp_set_script_translations( $this->handle, 'surecart', WP_LANG_DIR . '/plugins/' );

		// common localizations.
		wp_localize_script(
			$this->handle,
			'scData',
			$this->data
		);

		wp_localize_script( $this->handle, 'scIconPath', esc_url_raw( plugin_dir_url( SURECART_PLUGIN_FILE ) . 'dist/icon-assets' ) );

		// custom localizations.
		$this->localize( $this->handle );
	}

	protected function localize( $handle ) {
	}
}

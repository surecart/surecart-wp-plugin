<?php

namespace CheckoutEngine\Support\Scripts;

use CheckoutEngine\Models\Account;
use CheckoutEngine\Support\Currency;

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
	protected $dependencies = [ 'ce-core-data', 'ce-ui-data' ];

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
		wp_enqueue_script( 'checkout-engine-components' );
		wp_enqueue_style( 'checkout-engine-themes-default' );
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
		$asset_file = include plugin_dir_path( CHECKOUT_ENGINE_PLUGIN_FILE ) . "dist/$this->path.asset.php";

		// Enqueue scripts.
		\CheckoutEngine::core()->assets()->enqueueScript(
			$this->handle,
			trailingslashit( \CheckoutEngine::core()->assets()->getUrl() ) . "dist/$this->path.js",
			array_merge( $asset_file['dependencies'], $this->dependencies ),
			$asset_file['version']
		);

		if ( in_array( 'currency', $this->with_data ) ) {
			$this->data['currency_code'] = Account::find()->currency;
		}
		if ( in_array( 'supported_currencies', $this->with_data ) ) {
			$this->data['supported_currencies'] = Currency::getSupportedCurrencies();
		}
		if ( in_array( 'links', $this->with_data ) ) {
			$this->data['links'] = [];
			foreach ( array_keys( \CheckoutEngine::getAdminPageNames() ) as $name ) {
				$this->data['links'][ $name ] = esc_url_raw( add_query_arg( [ 'action' => 'edit' ], \CheckoutEngine::getUrl()->index( $name ) ) );
			}
		}

		// common localizations.
		wp_localize_script(
			$this->handle,
			'ceData',
			$this->data
		);

		// custom localizations.
		$this->localize( $this->handle );
	}

	protected function localize( $handle ) {
	}
}

<?php

namespace CheckoutEngine\WordPress;

use WPEmerge\ServiceProviders\ServiceProviderInterface;

/**
 * Register and enqueues assets.
 */
class AssetsServiceProvider implements ServiceProviderInterface
{
	/**
	 * {@inheritDoc}
	 */
	public function register( $container ) {
		// Nothing to register.
	}

	/**
	 * {@inheritDoc}
	 */
	public function bootstrap( $container ) {
		add_action( 'wp_enqueue_scripts', [$this, 'enqueueFrontendAssets'] );
		add_action( 'admin_enqueue_scripts', [$this, 'enqueueAdminAssets'] );
		add_action( 'wp_footer', [$this, 'loadSvgSprite'] );
	}

	/**
	 * Enqueue frontend assets.
	 *
	 * @return void
	 */
	public function enqueueFrontendAssets() {
		// Enqueue scripts.
		\CheckoutEngine::core()->assets()->enqueueScript(
			'theme-js-bundle',
			\CheckoutEngine::core()->assets()->getBundleUrl( 'frontend', '.js' ),
			[ 'jquery' ],
			true
		);

		// Enqueue styles.
		$style = \CheckoutEngine::core()->assets()->getBundleUrl( 'frontend', '.css' );

		if ( $style ) {
			\CheckoutEngine::core()->assets()->enqueueStyle(
				'theme-css-bundle',
				$style
			);
		}
	}

	/**
	 * Enqueue admin assets.
	 *
	 * @return void
	 */
	public function enqueueAdminAssets() {
		// Enqueue scripts.
		\CheckoutEngine::core()->assets()->enqueueScript(
			'theme-admin-js-bundle',
			\CheckoutEngine::core()->assets()->getBundleUrl( 'admin', '.js' ),
			[ 'jquery' ],
			true
		);

		// Enqueue styles.
		$style = \CheckoutEngine::core()->assets()->getBundleUrl( 'admin', '.css' );

		if ( $style ) {
			\CheckoutEngine::core()->assets()->enqueueStyle(
				'theme-admin-css-bundle',
				$style
			);
		}
	}

	/**
	 * Load SVG sprite.
	 *
	 * @return void
	 */
	public function loadSvgSprite() {
		$file_path = implode(
			DIRECTORY_SEPARATOR,
			array_filter(
				[
					plugin_dir_url( CHECKOUT_ENGINE_PLUGIN_FILE ),
					'dist',
					'images',
					'sprite.svg'
				]
			)
		);

		if ( ! file_exists( $file_path ) ) {
			return;
		}

		readfile( $file_path );
	}
}

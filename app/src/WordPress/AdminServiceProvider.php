<?php

namespace CheckoutEngine\WordPress;

use WPEmerge\ServiceProviders\ServiceProviderInterface;

/**
 * Register admin-related entities, like admin menu pages.
 */
class AdminServiceProvider implements ServiceProviderInterface {
	/**
	 * Holds pages
	 *
	 * @var array
	 */
	protected $pages = [];

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
		add_action( 'admin_menu', array( $this, 'registerAdminPages' ) );
	}

	/**
	 * Register admin pages.
	 *
	 * @return void
	 */
	public function registerAdminPages() {
		$slug = 'ce-dashboard';

		add_menu_page( __( 'Dashboard', 'checkout_engine' ), __( 'Checkout Engine', 'checkout_engine' ), 'manage_options', $slug, function() {} );

		$this->pages = [
			'dashboard' => add_submenu_page( $slug, __( 'Dashboard', 'checkout_engine' ), __( 'Dashboard', 'checkout_engine' ), 'manage_options', $slug, function() {} ),
			'orders'    => add_submenu_page( $slug, __( 'Orders', 'checkout_engine' ), __( 'Orders', 'checkout_engine' ), 'manage_options', 'ce-orders', function() {} ),
			'products'  => add_submenu_page( $slug, __( 'Products', 'checkout_engine' ), __( 'Products', 'checkout_engine' ), 'manage_options', 'ce-products', function() {} ),
			'abandoned' => add_submenu_page( $slug, __( 'Abandoned Orders', 'checkout_engine' ), __( 'Abandoned Orders', 'checkout_engine' ), 'manage_options', 'ce-abandoned-orders', function() {} ),
			'settings'  => add_submenu_page( $slug, __( 'Settings', 'checkout_engine' ), __( 'Settings', 'checkout_engine' ), 'manage_options', 'ce-settings', function() {} ),
		];

		$this->registerScripts();
	}

	public function registerScripts() {
		add_action( "admin_print_scripts-{$this->pages['products']}", [ $this, 'productsPageScripts' ] );
	}

	public function productsPageScripts() {
		// upload media
		wp_enqueue_media();

		// component styles
		wp_enqueue_style( 'wp-components' );

		// Enqueue scripts.
		\CheckoutEngine::core()->assets()->enqueueScript(
			'checkoutengine/scripts/admin/products',
			trailingslashit( \CheckoutEngine::core()->assets()->getUrl() ) . 'dist/admin/products.js',
			[
				'wp-components',
				'wp-element',
				'wp-codemirror',
				'wp-api',
				'wp-i18n',
				'wp-editor',
				'wp-blob',
				'wp-blocks',
				'wp-data',
				'wp-core-data',
			],
			true
		);
	}
}

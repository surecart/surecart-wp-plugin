<?php

namespace CheckoutEngine\WordPress;

use WPEmerge\ServiceProviders\ServiceProviderInterface;
use CheckoutEngine\WordPress\Admin\AdminMenuPageService;
use CheckoutEngine\WordPress\Admin\UserProfileService;

/**
 * Register admin-related entities, like admin menu pages.
 */
class AdminServiceProvider implements ServiceProviderInterface {
	/**
	 * Admin pages
	 *
	 * @var array
	 */
	protected $pages = [];

	/**
	 * {@inheritDoc}
	 *
	 *  @param  \Pimple\Container $container Service Container.
	 */
	public function register( $container ) {
		$app = $container[ WPEMERGE_APPLICATION_KEY ];

		$container['admin_pages'] = function () {
			return new AdminMenuPageService();
		};

		$container['user_profile'] = function() {
			return new UserProfileService();
		};

		$app->alias( 'admin_pages', 'admin_pages' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function bootstrap( $container ) {
		$container['admin_pages']->register();
		$container['user_profile']->register();
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
				'wp-edit-post',
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

<?php

namespace CheckoutEngine\WordPress\Admin;

use CheckoutEngine\Controllers\Admin\Orders\OrderScriptsController;
use CheckoutEngine\Controllers\Admin\Coupons\CouponScriptsController;
use CheckoutEngine\Controllers\Admin\Products\ProductScriptsController;
use CheckoutEngine\Controllers\Admin\Abandoned\AbandonedCheckoutScriptsController;

class AdminMenuPageService {
	protected $slug = 'ce-getting-started';

	/**
	 * Add menu items.
	 */
	public function register() {
		add_action( 'admin_menu', [ $this, 'registerAdminPages' ] );
	}

	/**
	 * Register admin pages.
	 *
	 * @return void
	 */
	public function registerAdminPages() {
		\add_menu_page( __( 'Dashboard', 'checkout_engine' ), __( 'Checkout Engine', 'checkout_engine' ), 'edit_pk_products', $this->slug, '__return_false' );

		$this->pages = [
			'get-started' => \add_submenu_page( $this->slug, __( 'Getting Started', 'checkout_engine' ), __( 'Getting Started', 'checkout_engine' ), 'edit_pk_products', $this->slug, '__return_false' ),
			'orders'      => \add_submenu_page( $this->slug, __( 'Orders', 'checkout_engine' ), __( 'Orders', 'checkout_engine' ), 'edit_pk_orders', 'ce-orders', '__return_false' ),
			'products'    => \add_submenu_page( $this->slug, __( 'Products', 'checkout_engine' ), __( 'Products', 'checkout_engine' ), 'edit_pk_products', 'ce-products', '__return_false' ),
			'coupons'     => \add_submenu_page( $this->slug, __( 'Coupons', 'checkout_engine' ), __( 'Coupons', 'checkout_engine' ), 'edit_pk_coupons', 'ce-coupons', '__return_false' ),
			'customers'   => \add_submenu_page( $this->slug, __( 'Customers', 'checkout_engine' ), __( 'Customers', 'checkout_engine' ), 'edit_pk_customers', 'ce-customers', '__return_false' ),
			'forms'       => \add_submenu_page( $this->slug, __( 'Forms', 'checkout_engine' ), __( 'Forms', 'checkout_engine' ), 'edit_pk_customers', 'ce-forms', '__return_false' ),
			'abandoned'   => \add_submenu_page( $this->slug, __( 'Abandoned Orders', 'checkout_engine' ), __( 'Abandoned Orders', 'checkout_engine' ), 'edit_pk_orders', 'ce-abandoned-checkouts', '__return_false' ),
			'settings'    => \add_submenu_page( $this->slug, __( 'Settings', 'checkout_engine' ), __( 'Settings', 'checkout_engine' ), 'manage_account_settings', 'ce-settings', '__return_false' ),
		];

		$this->registerScripts();
	}

	public function getPageHooks() {
		return $this->pages;
	}

	/**
	 * Get the admin page hook suffix.
	 */
	public function getPageHook( $name ) {
		return $this->pages[ $name ];
	}

	public function registerEditorScripts() {
		wp_enqueue_script( 'checkout-engine-components' );
		wp_enqueue_style( 'checkout-engine-themes-default' );
		wp_enqueue_media();
		wp_enqueue_style( 'wp-components' );
	}

	public function registerScripts() {
		add_action( "admin_print_scripts-{$this->pages['coupons']}", \CheckoutEngine::closure()->method( CouponScriptsController::class, 'enqueue' ) );
		add_action( "admin_print_scripts-{$this->pages['orders']}", \CheckoutEngine::closure()->method( OrderScriptsController::class, 'enqueue' ) );
		add_action( "admin_print_scripts-{$this->pages['abandoned']}", \CheckoutEngine::closure()->method( AbandonedCheckoutScriptsController::class, 'enqueue' ) );
		add_action( "admin_print_scripts-{$this->pages['products']}", \CheckoutEngine::closure()->method( ProductScriptsController::class, 'enqueue' ) );
		add_action( "admin_print_scripts-{$this->pages['settings']}", [ $this, 'settingsPageScripts' ] );
	}

	/**
	 * Products page scripts.
	 */
	public function settingsPageScripts() {
		wp_enqueue_script( 'checkout-engine-components' );
		wp_enqueue_style( 'checkout-engine-themes-default' );

		// upload media
		wp_enqueue_media();

		// component styles
		wp_enqueue_style( 'wp-components' );

		// Enqueue scripts.
		\CheckoutEngine::core()->assets()->enqueueScript(
			'checkoutengine/scripts/admin/settings',
			trailingslashit( \CheckoutEngine::core()->assets()->getUrl() ) . 'dist/admin/settings.js',
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

	/**
	 * Products page scripts.
	 */
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

<?php

namespace CheckoutEngine\WordPress\Admin\Menus;

use CheckoutEngine\Models\ApiToken;

/**
 * Handles creation and enqueueing of admin menu pages and assets.
 */
class AdminMenuPageService {
	/**
	 * Top level menu slug.
	 *
	 * @var string
	 */
	protected $slug = 'ce-getting-started';

	/**
	 * Pages
	 *
	 * @var array
	 */
	protected $pages = [];

	/**
	 * Add menu items.
	 */
	public function bootstrap() {
		add_action( 'admin_menu', [ $this, 'registerAdminPages' ] );
	}

	/**
	 * Register admin pages.
	 *
	 * @return void
	 */
	public function registerAdminPages() {
		\add_menu_page( __( 'Dashboard', 'checkout_engine' ), __( 'SureCart', 'checkout_engine' ), 'install_plugins', $this->slug, '__return_false', 'dashicons-cart' );

		// not yet installed.
		if ( ! ApiToken::get() ) {
			$this->pages = [
				'get-started'     => \add_submenu_page( $this->slug, __( 'Getting Started', 'checkout_engine' ), __( 'Getting Started', 'checkout_engine' ), 'install_plugins', $this->slug, '__return_false' ),
				'complete-signup' => \add_submenu_page( null, __( 'Complete Signup', 'checkout_engine' ), __( 'Complete Signup', 'checkout_engine' ), 'install_plugins', 'ce-complete-signup', '__return_false' ),
				'plugin'          => \add_submenu_page( $this->slug, __( 'Plugin', 'checkout_engine' ), __( 'Plugin', 'checkout_engine' ), 'manage_options', 'ce-plugin', '__return_false' ),
			];
			return;
		}

		$this->pages = [
			'get-started'     => \add_submenu_page( $this->slug, __( 'Getting Started', 'checkout_engine' ), __( 'Getting Started', 'checkout_engine' ), 'install_plugins', $this->slug, '__return_false' ),
			'complete-signup' => \add_submenu_page( null, __( 'Complete Signup', 'checkout_engine' ), __( 'Complete Signup', 'checkout_engine' ), 'install_plugins', 'ce-complete-signup', '__return_false' ),
			'orders'          => \add_submenu_page( $this->slug, __( 'Orders', 'checkout_engine' ), __( 'Orders', 'checkout_engine' ), 'edit_ce_orders', 'ce-orders', '__return_false' ),
			'products'        => \add_submenu_page( $this->slug, __( 'Products', 'checkout_engine' ), __( 'Products', 'checkout_engine' ), 'edit_ce_products', 'ce-products', '__return_false' ),
			'coupons'         => \add_submenu_page( $this->slug, __( 'Coupons', 'checkout_engine' ), __( 'Coupons', 'checkout_engine' ), 'edit_ce_coupons', 'ce-coupons', '__return_false' ),
			'customers'       => \add_submenu_page( $this->slug, __( 'Customers', 'checkout_engine' ), __( 'Customers', 'checkout_engine' ), 'edit_ce_customers', 'ce-customers', '__return_false' ),
			'subscriptions'   => \add_submenu_page( $this->slug, __( 'Subscriptions', 'checkout_engine' ), __( 'Subscriptions', 'checkout_engine' ), 'edit_ce_subscriptions', 'ce-subscriptions', '__return_false' ),
			'invoices'        => \add_submenu_page( null, __( 'Invoices', 'checkout_engine' ), __( 'Invoices', 'checkout_engine' ), 'edit_ce_invoices', 'ce-invoices', '__return_false' ),
			'upgrade-paths'   => \add_submenu_page( $this->slug, __( 'Upgrade Groups', 'checkout_engine' ), __( 'Upgrade Groups', 'checkout_engine' ), 'edit_ce_products', 'ce-product-groups', '__return_false' ),
			// 'abandoned'       => \add_submenu_page( $this->slug, __( 'Abandoned Orders', 'checkout_engine' ), __( 'Abandoned Orders', 'checkout_engine' ), 'edit_ce_orders', 'ce-abandoned-orders', '__return_false' ),
			'forms'           => \add_submenu_page( $this->slug, __( 'Forms', 'checkout_engine' ), __( 'Forms', 'checkout_engine' ), 'edit_posts', 'edit.php?post_type=ce_form', '' ),
			'plugin'          => \add_submenu_page( $this->slug, __( 'Plugin', 'checkout_engine' ), __( 'Plugin', 'checkout_engine' ), 'manage_options', 'ce-plugin', '__return_false' ),
			'settings'        => \add_submenu_page( $this->slug, __( 'Settings', 'checkout_engine' ), __( 'Settings', 'checkout_engine' ), 'manage_options', 'ce-settings', '__return_false' ),
		];
	}
}

<?php

namespace SureCart\WordPress\Admin\Menus;

use SureCart\Models\ApiToken;

/**
 * Handles creation and enqueueing of admin menu pages and assets.
 */
class AdminMenuPageService {
	/**
	 * Top level menu slug.
	 *
	 * @var string
	 */
	protected $slug = 'sc-getting-started';

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
		$logo = file_get_contents( plugin_dir_path( SURECART_PLUGIN_FILE ) . 'images/icon.svg' );
		\add_menu_page( __( 'Dashboard', 'surecart' ), __( 'SureCart', 'surecart' ), 'install_plugins', $this->slug, '__return_false', 'data:image/svg+xml;base64,' . base64_encode( $logo ), 30 );

		// not yet installed.
		if ( ! ApiToken::get() ) {
			$this->pages = [
				'get-started'     => \add_submenu_page( $this->slug, __( 'Getting Started', 'surecart' ), __( 'Getting Started', 'surecart' ), 'install_plugins', $this->slug, '__return_false' ),
				'complete-signup' => \add_submenu_page( null, __( 'Complete Signup', 'surecart' ), __( 'Complete Signup', 'surecart' ), 'install_plugins', 'sc-complete-signup', '__return_false' ),
				'settings'        => \add_submenu_page( $this->slug, __( 'Settings', 'surecart' ), __( 'Settings', 'surecart' ), 'manage_options', 'sc-settings', '__return_false' ),
			];
			return;
		}

		$cart_page_id = \SureCart::pages()->getId( 'cart' );

		$this->pages = [
			'get-started'     => \add_submenu_page( $this->slug, __( 'Getting Started', 'surecart' ), __( 'Getting Started', 'surecart' ), 'install_plugins', $this->slug, '__return_false' ),
			'complete-signup' => \add_submenu_page( null, __( 'Complete Signup', 'surecart' ), __( 'Complete Signup', 'surecart' ), 'install_plugins', 'sc-complete-signup', '__return_false' ),
			'products'        => \add_submenu_page( $this->slug, __( 'Products', 'surecart' ), __( 'Products', 'surecart' ), 'edit_sc_products', 'sc-products', '__return_false' ),
			'coupons'         => \add_submenu_page( $this->slug, __( 'Coupons', 'surecart' ), __( 'Coupons', 'surecart' ), 'edit_sc_coupons', 'sc-coupons', '__return_false' ),
			'orders'          => \add_submenu_page( $this->slug, __( 'Orders', 'surecart' ), __( 'Orders', 'surecart' ), 'edit_sc_orders', 'sc-orders', '__return_false' ),
			'invoices'        => \add_submenu_page( $this->slug, __( 'Invoices', 'surecart' ), __( 'Invoices', 'surecart' ), 'edit_sc_invoices', 'sc-invoices', '__return_false' ),
			'customers'       => \add_submenu_page( $this->slug, __( 'Customers', 'surecart' ), __( 'Customers', 'surecart' ), 'edit_sc_customers', 'sc-customers', '__return_false' ),
			'subscriptions'   => \add_submenu_page( $this->slug, __( 'Subscriptions', 'surecart' ), __( 'Subscriptions', 'surecart' ), 'edit_sc_subscriptions', 'sc-subscriptions', '__return_false' ),
			'cart'            => get_edit_post_link( $cart_page_id ) ? \add_submenu_page( $this->slug, __( 'Cart', 'surecart' ), __( 'Cart', 'surecart' ), 'manage_options', 'post.php?post=' . (int) $cart_page_id . '&action=edit', '' ) : null,
			// 'upgrade-paths'   => \add_submenu_page( $this->slug, __( 'Upgrade Groups', 'surecart' ), __( 'Upgrade Groups', 'surecart' ), 'edit_sc_products', 'sc-product-groups', '__return_false' ),
			// 'abandoned'       => \add_submenu_page( $this->slug, __( 'Abandoned Orders', 'surecart' ), __( 'Abandoned Orders', 'surecart' ), 'edit_sc_orders', 'sc-abandoned-orders', '__return_false' ),
			'forms'           => \add_submenu_page( $this->slug, __( 'Forms', 'surecart' ), __( 'Forms', 'surecart' ), 'edit_posts', 'edit.php?post_type=sc_form', '' ),
			'settings'        => \add_submenu_page( $this->slug, __( 'Settings', 'surecart' ), __( 'Settings', 'surecart' ), 'manage_options', 'sc-settings', '__return_false' ),
		];
	}
}

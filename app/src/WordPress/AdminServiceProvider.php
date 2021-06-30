<?php

namespace CheckoutEngine\WordPress;

use WPEmerge\ServiceProviders\ServiceProviderInterface;

/**
 * Register admin-related entities, like admin menu pages.
 */
class AdminServiceProvider implements ServiceProviderInterface {
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
		add_menu_page( __( 'Dashboard', 'checkout_engine' ), __( 'Checkout Engine', 'checkout_engine' ), 'manage_options', 'ce-settings', function() {} );
		add_submenu_page( 'ce-settings', __( 'Products', 'checkout_engine' ), __( 'Products', 'checkout_engine' ), 'manage_options', 'ce-products', function() {} );
	}
}

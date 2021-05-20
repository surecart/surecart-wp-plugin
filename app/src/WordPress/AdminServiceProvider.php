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
		add_action( 'admin_menu', [$this, 'registerAdminPages'] );
	}

	/**
	 * Register admin pages.
	 *
	 * @return void
	 */
	public function registerAdminPages() {
		add_menu_page( __('Dashboard', 'checkout-engine'), __('Checkout Engine', 'checkout-engine'), 'manage_options', 'checkout-engine-settings', function() {} );
	}
}

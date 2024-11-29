<?php

namespace SureCart\WordPress\Cache;

/**
 * LiteSpeed Cache Service.
 */
class LiteSpeedCacheService {
	/**
	 * Bootstrap the service.
	 */
	public function bootstrap() {
		add_action( 'wp', [ $this, 'disableCacheForCustomerDashboard' ] );
	}

	/**
	 * Disable cache for customer dashboard.
	 *
	 * @return void
	 */
	public function disableCacheForCustomerDashboard() {
		$customer_dashboard_url = \SureCart::pages()->url( 'dashboard' );

		$current_url = ( is_ssl() ? 'https://' : 'http://' ) . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];

		if ( trim( $current_url, '/' ) === trim( $customer_dashboard_url, '/' ) ) {
			do_action( 'litespeed_control_set_nocache', 'surecart customer dashboard' );
		}
	}
}

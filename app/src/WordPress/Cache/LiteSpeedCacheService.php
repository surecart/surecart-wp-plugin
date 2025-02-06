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
		if ( ! \SureCart::pages()->isCustomerDashboardPageByUrl() ) {
			return;
		}

		do_action( 'litespeed_control_set_nocache', 'surecart customer dashboard' );
	}
}

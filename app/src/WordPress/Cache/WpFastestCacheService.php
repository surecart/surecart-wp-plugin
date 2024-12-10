<?php

namespace SureCart\WordPress\Cache;

/**
 * WP Fastest Cache Service.
 */
class WpFastestCacheService {
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
		// If WpFastestCache, class available, then only proceed.
		if ( ! class_exists( 'WpFastestCache' ) ) {
			return;
		}

		if ( \SureCart::pages()->isCustomerDashboardPageByUrl() && function_exists( 'wpfc_exclude_current_page' ) ) {
			wpfc_exclude_current_page();
		}
	}
}

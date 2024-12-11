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
		// If wpfc_exclude_current_page', class available and customer dashboard page, then only proceed.
		if ( ! function_exists( 'wpfc_exclude_current_page' ) || ! \SureCart::pages()->isCustomerDashboardPageByUrl() ) {
			return;
		}

		wpfc_exclude_current_page();
	}
}

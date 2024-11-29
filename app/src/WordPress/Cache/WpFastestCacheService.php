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
		// If WpFastestCache, class available, then only proceed.
		if ( ! class_exists( 'WpFastestCache' ) ) {
			return;
		}

		add_action( 'init', [ $this, 'disableCacheForCustomerDashboard' ] );
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
			// TODO: This should be working, but not working as of now.
			wpfc_exclude_current_page(); // or, do_action( 'wpfc_exclude_current_page' );

			// If has option WpFastestCacheExclude, then update it with the current URL.
			// $cache_option  = get_option( 'WpFastestCacheExclude', '' );
			// $wpfc_excludes = json_decode( $cache_option );

			// // If already customer-dashboard is excluded and found in the list, then return.
			// foreach ( $wpfc_excludes as $exclude ) {
			// 	if ( 'exact' === $exclude->prefix && 'customer-dashboard' === $exclude->content ) {
			// 		return;
			// 	}
			// }

			// $exclude = [
			// 	'prefix'  => 'exact',
			// 	'content' => 'customer-dashboard',
			// 	'type'    => 'page',
			// ];

			// $wpfc_excludes[] = $exclude;

			// $excludes = json_encode( $wpfc_excludes );

			// // if has option, then update otherwise add new option.
			// if ( $cache_option ) {
			// 	update_option( 'WpFastestCacheExclude', $excludes );
			// } else {
			// 	add_option( 'WpFastestCacheExclude', $excludes );
			// }
		}
	}
}

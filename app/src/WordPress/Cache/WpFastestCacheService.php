<?php

namespace SureCart\WordPress\Cache;

/**
 * WP Fastest Cache Service.
 */
class WpFastestCacheService extends CacheService {
	/**
	 * Check if WP Fastest Cache plugin is active.
	 *
	 * @return bool
	 */
	protected function isCachePluginActive(): bool {
		return function_exists( 'wpfc_exclude_current_page' );
	}

	/**
	 * Disable cache for the current page.
	 *
	 * @param string $reason Reason for disabling cache.
	 * @return void
	 */
	protected function disableCache( string $reason ): void {
		wpfc_exclude_current_page();
	}
}

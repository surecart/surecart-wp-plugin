<?php

namespace SureCart\WordPress\Cache;

/**
 * Generic, plugin-agnostic cache service.
 *
 * Defines the DONOTCACHEPAGE constant on SureCart dynamic pages so any
 * caching layer honoring the WordPress convention (WP Rocket, WP Super Cache,
 * SWIS, host caches, etc.) skips them without a dedicated integration.
 */
class DoNotCachePageService extends CacheService {
	/**
	 * Always active — the constant is a WordPress-wide convention, not specific to any cache plugin.
	 *
	 * @return bool
	 */
	protected function isCachePluginActive(): bool {
		return true;
	}

	/**
	 * Disable cache for the current page.
	 *
	 * @param string $reason Reason for disabling cache.
	 * @return void
	 */
	protected function disableCache( string $reason ): void {
		if ( ! defined( 'DONOTCACHEPAGE' ) ) {
			define( 'DONOTCACHEPAGE', true );
		}
	}
}

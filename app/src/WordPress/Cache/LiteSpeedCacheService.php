<?php

namespace SureCart\WordPress\Cache;

/**
 * LiteSpeed Cache Service.
 *
 * Handles LiteSpeed Cache integration for SureCart including:
 * - Excluding dynamic pages from caching (checkout, dashboard, cart)
 * - Excluding SureCart REST API requests from caching
 * - Adding vary cookies for session handling
 * - Purging cache on purchase events
 */
class LiteSpeedCacheService extends CacheService {
	/**
	 * Bootstrap the service.
	 *
	 * @return void
	 */
	public function bootstrap() {
		parent::bootstrap();

		// Add vary cookies for SureCart sessions.
		add_filter( 'litespeed_vary_cookies', [ $this, 'addVaryCookies' ] );

		// Exclude critical WordPress scripts from JS defer.
		add_filter( 'litespeed_optm_js_defer_exc', [ $this, 'excludeScriptsFromDefer' ] );
	}

	/**
	 * Check if LiteSpeed Cache plugin is active.
	 *
	 * @return bool
	 */
	protected function isCachePluginActive(): bool {
		return has_action( 'litespeed_control_set_nocache' );
	}

	/**
	 * Disable cache for the current page.
	 *
	 * @param string $reason Reason for disabling cache.
	 * @return void
	 */
	protected function disableCache( string $reason ): void {
		do_action( 'litespeed_control_set_nocache', $reason );
	}

	/**
	 * Add SureCart session cookies to LiteSpeed Cache vary cookies.
	 *
	 * This ensures that cached pages vary based on SureCart session state.
	 *
	 * @param array $cookies Existing vary cookies.
	 * @return array Modified vary cookies array.
	 */
	public function addVaryCookies( $cookies ) {
		if ( ! \is_array( $cookies ) ) {
			$cookies = [];
		}

		return array_merge( $cookies, $this->getVaryCookies() );
	}

	/**
	 * Exclude critical WordPress scripts from JS defer.
	 *
	 * @param array $excludes Existing excluded scripts.
	 * @return array Modified excludes array.
	 */
	public function excludeScriptsFromDefer( $excludes ) {
		if ( ! \is_array( $excludes ) ) {
			$excludes = [];
		}

		return array_merge( $excludes, $this->getJsDeferExcludes() );
	}

	/**
	 * Purge product cache when a purchase is created or revoked.
	 *
	 * This helps keep product pages up-to-date with stock levels.
	 *
	 * @param \SureCart\Models\Purchase $purchase The purchase model.
	 * @return void
	 */
	public function purgeProductCacheOnPurchase( $purchase ) {
		// Only purge if the action is available.
		if ( ! has_action( 'litespeed_purge_post' ) ) {
			return;
		}

		// Get the product from the purchase.
		$product = $purchase->product ?? null;

		if ( empty( $product ) ) {
			return;
		}

		// Get the WordPress post ID for the product.
		$post_id = $product->metadata->wp_id ?? null;

		if ( ! empty( $post_id ) ) {
			do_action( 'litespeed_purge_post', $post_id );
		}

		/**
		 * Action fired after purging cache for a product on purchase.
		 *
		 * @param \SureCart\Models\Purchase $purchase The purchase model.
		 * @param mixed $product The product model.
		 */
		do_action( 'surecart/cache/purged_product', $purchase, $product );
	}
}

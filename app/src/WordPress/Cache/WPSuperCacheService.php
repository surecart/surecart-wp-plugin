<?php

namespace SureCart\WordPress\Cache;

/**
 * WP Super Cache Service.
 *
 * Handles WP Super Cache integration for SureCart including:
 * - Excluding dynamic pages from caching (checkout, dashboard, cart)
 * - Excluding SureCart REST API requests from caching
 * - Purging cache on purchase events
 */
class WPSuperCacheService extends CacheService {
	/**
	 * Check if WP Super Cache plugin is active.
	 *
	 * @return bool
	 */
	protected function isCachePluginActive(): bool {
		return defined( 'WPCACHEHOME' ) || function_exists( 'wp_cache_clear_cache' );
	}

	/**
	 * Disable cache for the current page.
	 *
	 * WP Super Cache respects the DONOTCACHEPAGE constant.
	 *
	 * @param string $reason Reason for disabling cache.
	 * @return void
	 */
	protected function disableCache( string $reason ): void {
		if ( ! defined( 'DONOTCACHEPAGE' ) ) {
			define( 'DONOTCACHEPAGE', true );
		}
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
		// Get the product from the purchase.
		$product = $purchase->product ?? null;

		if ( empty( $product ) ) {
			return;
		}

		// Get the WordPress post ID for the product.
		$post_id = $product->metadata->wp_id ?? null;

		if ( ! empty( $post_id ) ) {
			// Use WP Super Cache function if available.
			if ( function_exists( 'wpsc_delete_post_cache' ) ) {
				wpsc_delete_post_cache( $post_id );
			} elseif ( function_exists( 'wp_cache_post_change' ) ) {
				wp_cache_post_change( $post_id );
			}
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

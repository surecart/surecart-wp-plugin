<?php

namespace SureCart\WordPress\Cache;

/**
 * LiteSpeed Cache Service.
 *
 * Handles LiteSpeed Cache integration for SureCart using LiteSpeed's native hooks:
 * - litespeed_control_finalize: For cache control decisions (recommended by LiteSpeed)
 * - litespeed_vary_cookies: For session-based cache variations
 * - litespeed_optm_js_defer_exc: For excluding critical scripts from defer
 * - litespeed_purge_post: For purging product cache on purchase
 * - litespeed_control_set_nocache: For disabling cache
 */
class LiteSpeedCacheService extends CacheService {
	/**
	 * Bootstrap the service.
	 *
	 * Uses LiteSpeed's native hooks instead of generic WordPress hooks
	 * for more reliable cache control integration.
	 *
	 * @return void
	 */
	public function bootstrap() {
		// Use LiteSpeed's finalize hook for cache control decisions.
		// This runs after LiteSpeed's initial checks but before final cacheability determination.
		// This is the recommended approach used by WooCommerce and other plugins.
		add_action( 'litespeed_control_finalize', [ $this, 'onControlFinalize' ] );

		// Disable cache for SureCart REST API requests.
		add_action( 'rest_api_init', [ $this, 'maybeDisableCacheForRestApi' ], 1 );

		// Add vary cookies for SureCart sessions.
		add_filter( 'litespeed_vary_cookies', [ $this, 'addVaryCookies' ] );

		// Exclude critical WordPress scripts from JS defer.
		add_filter( 'litespeed_optm_js_defer_exc', [ $this, 'excludeScriptsFromDefer' ] );

		// Purge cache on purchase events.
		add_action( 'surecart/purchase_created', [ $this, 'purgeProductCacheOnPurchase' ] );
		add_action( 'surecart/purchase_revoked', [ $this, 'purgeProductCacheOnPurchase' ] );
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
	 * Disable cache for the current page using LiteSpeed's native action.
	 *
	 * @param string $reason Reason for disabling cache.
	 * @return void
	 */
	protected function disableCache( string $reason ): void {
		do_action( 'litespeed_control_set_nocache', $reason );
	}

	/**
	 * Handle cache control during LiteSpeed's finalize phase.
	 *
	 * This is called via the 'litespeed_control_finalize' action which runs
	 * after LiteSpeed's initial checks but before the final cacheability determination.
	 * This is the recommended approach for third-party plugins (same as WooCommerce).
	 *
	 * @param string|false $esi_id ESI block ID if this is an ESI request, false otherwise.
	 * @return void
	 */
	public function onControlFinalize( $esi_id = false ) {
		// Only proceed if the page is currently marked as cacheable.
		// Using LiteSpeed's native filter to check cacheability.
		if ( ! apply_filters( 'litespeed_control_cacheable', false ) ) {
			return;
		}

		// Disable cache for customer dashboard.
		if ( $this->isCustomerDashboardPage() ) {
			$this->disableCacheWithBrowserHeaders( 'SureCart customer dashboard' );
			return;
		}

		// Disable cache for checkout page.
		if ( $this->isCheckoutPage() ) {
			$this->disableCacheWithBrowserHeaders( 'SureCart checkout page' );
			return;
		}

		// Disable cache for pages with checkout form blocks.
		if ( $this->hasCheckoutFormBlock() ) {
			$this->disableCacheWithBrowserHeaders( 'SureCart checkout form block' );
			return;
		}

		// Disable cache for buy pages (product-specific checkout).
		if ( $this->isBuyPage() ) {
			$this->disableCacheWithBrowserHeaders( 'SureCart buy page' );
			return;
		}
	}

	/**
	 * Add SureCart session cookies to LiteSpeed Cache vary cookies.
	 *
	 * This ensures that cached pages vary based on SureCart session state.
	 * Uses the 'litespeed_vary_cookies' filter.
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
	 * Uses the 'litespeed_optm_js_defer_exc' filter.
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
	 * Uses LiteSpeed's native 'litespeed_purge_post' action.
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

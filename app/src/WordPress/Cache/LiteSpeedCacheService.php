<?php

namespace SureCart\WordPress\Cache;

/**
 * LiteSpeed Cache Service.
 */
class LiteSpeedCacheService extends CacheService {
	/**
	 * Bootstrap the service.
	 *
	 * @return void
	 */
	public function bootstrap() {
		// Use LiteSpeed's finalize hook for cache control decisions.
		add_action( 'litespeed_control_finalize', [ $this, 'onControlFinalize' ] );

		// Add vary cookies for SureCart sessions.
		add_filter( 'litespeed_vary_cookies', [ $this, 'addVaryCookies' ] );

		// Exclude critical WordPress scripts from JS defer.
		add_filter( 'litespeed_optm_js_defer_exc', [ $this, 'excludeScriptsFromDefer' ] );

		// Disable cache for SureCart REST API requests.
		add_action( 'rest_api_init', [ $this, 'maybeDisableCacheForRestApi' ], 1 );

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
	 * Disable cache for the current page.
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
	 * @param string|false $esi_id ESI block ID if this is an ESI request.
	 * @return void
	 */
	public function onControlFinalize( $esi_id = false ) {
		// Only proceed if the page is currently marked as cacheable.
		if ( ! apply_filters( 'litespeed_control_cacheable', false ) ) {
			return;
		}

		if ( $this->isCustomerDashboardPage() ) {
			$this->disableCacheWithBrowserHeaders( 'SureCart customer dashboard' );
			return;
		}

		if ( $this->isCheckoutPage() ) {
			$this->disableCacheWithBrowserHeaders( 'SureCart checkout page' );
			return;
		}

		if ( $this->hasCheckoutFormBlock() ) {
			$this->disableCacheWithBrowserHeaders( 'SureCart checkout form block' );
			return;
		}

		if ( $this->isBuyPage() ) {
			$this->disableCacheWithBrowserHeaders( 'SureCart buy page' );
			return;
		}
	}

	/**
	 * Add SureCart session cookies to LiteSpeed Cache vary cookies.
	 *
	 * @param array $cookies Existing vary cookies.
	 * @return array
	 */
	public function addVaryCookies( $cookies ) {
		if ( ! is_array( $cookies ) ) {
			$cookies = [];
		}

		return array_merge( $cookies, $this->getVaryCookies() );
	}

	/**
	 * Exclude critical scripts from JS defer.
	 *
	 * @param array $excludes Existing excluded scripts.
	 * @return array
	 */
	public function excludeScriptsFromDefer( $excludes ) {
		if ( ! is_array( $excludes ) ) {
			$excludes = [];
		}

		return array_merge( $excludes, $this->getJsDeferExcludes() );
	}

	/**
	 * Purge product cache when a purchase is created or revoked.
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

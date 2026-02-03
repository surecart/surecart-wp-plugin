<?php

namespace SureCart\WordPress\Cache;

/**
 * Abstract Cache Service.
 *
 * Provides common functionality for cache plugin integrations.
 */
abstract class CacheService {
	/**
	 * Bootstrap the service.
	 *
	 * @return void
	 */
	public function bootstrap() {
		// Disable cache for SureCart dynamic pages.
		add_action( 'wp', [ $this, 'maybeDisableCache' ] );

		// Disable cache for SureCart REST API requests.
		add_action( 'rest_api_init', [ $this, 'maybeDisableCacheForRestApi' ], 1 );

		// Purge cache on purchase events.
		add_action( 'surecart/purchase_created', [ $this, 'purgeProductCacheOnPurchase' ] );
		add_action( 'surecart/purchase_revoked', [ $this, 'purgeProductCacheOnPurchase' ] );
	}

	/**
	 * Disable cache for the current page.
	 *
	 * @param string $reason Reason for disabling cache.
	 * @return void
	 */
	abstract protected function disableCache( string $reason ): void;

	/**
	 * Check if the cache plugin is active/available.
	 *
	 * @return bool
	 */
	abstract protected function isCachePluginActive(): bool;

	/**
	 * Check if the current page should be excluded from cache.
	 *
	 * @return bool
	 */
	public function shouldExcludeFromCache(): bool {
		return $this->isCustomerDashboardPage()
			|| $this->isCheckoutPage()
			|| $this->hasCheckoutFormBlock()
			|| $this->isBuyPage();
	}

	/**
	 * Maybe disable cache for SureCart dynamic pages.
	 *
	 * @return void
	 */
	public function maybeDisableCache() {
		if ( ! $this->isCachePluginActive() ) {
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
	 * Disable both server-side and browser caching for the current page.
	 *
	 * This ensures that:
	 * 1. The cache plugin doesn't cache the page (server-side)
	 * 2. The browser doesn't cache the page (client-side)
	 *
	 * Browser caching of dynamic eCommerce pages like checkouts, carts, and
	 * customer accounts can lead to stale data being displayed.
	 *
	 * @param string $reason Reason for disabling cache.
	 * @return void
	 */
	protected function disableCacheWithBrowserHeaders( string $reason ): void {
		// Disable server-side caching via the cache plugin.
		$this->disableCache( $reason );

		// Disable browser caching by sending no-cache headers.
		// This sends: Cache-Control: no-cache, must-revalidate, max-age=0
		// And other headers to prevent browser caching.
		if ( ! headers_sent() ) {
			nocache_headers();
		}
	}

	/**
	 * Maybe disable cache for SureCart REST API requests.
	 *
	 * SureCart relies on REST API for dynamic content like customer data,
	 * product information, and checkout processes. Caching these can cause
	 * issues like incorrect cart data or failed orders.
	 *
	 * @return void
	 */
	public function maybeDisableCacheForRestApi() {
		if ( ! $this->isCachePluginActive() ) {
			return;
		}

		// Check if this is a SureCart REST API request.
		if ( $this->isSureCartRestRequest() ) {
			$this->disableCacheWithBrowserHeaders( 'SureCart REST API request' );
		}
	}

	/**
	 * Check if the current request is a SureCart REST API request.
	 *
	 * @return bool
	 */
	protected function isSureCartRestRequest(): bool {
		// phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$request_uri = $_SERVER['REQUEST_URI'] ?? '';

		// Check if the request is for SureCart REST endpoints.
		// SureCart uses /wp-json/surecart/ namespace.
		if ( strpos( $request_uri, '/surecart/' ) !== false && strpos( $request_uri, 'wp-json' ) !== false ) {
			return true;
		}

		// Also check for the REST route query parameter.
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$rest_route = $_GET['rest_route'] ?? '';
		if ( strpos( $rest_route, '/surecart/' ) !== false ) {
			return true;
		}

		return false;
	}

	/**
	 * Purge product cache when a purchase is created or revoked.
	 *
	 * Override this method in child classes if the cache plugin
	 * supports purging specific posts/URLs.
	 *
	 * @param \SureCart\Models\Purchase $purchase The purchase model.
	 * @return void
	 */
	public function purgeProductCacheOnPurchase( $purchase ) {
		// Default implementation does nothing.
		// Override in child classes that support targeted purging.
	}

	/**
	 * Check if the current page is the customer dashboard page.
	 *
	 * @return bool
	 */
	protected function isCustomerDashboardPage(): bool {
		return \SureCart::pages()->isCustomerDashboardPageByUrl();
	}

	/**
	 * Check if the current page is the checkout page.
	 *
	 * @return bool
	 */
	protected function isCheckoutPage(): bool {
		$checkout_page_id = \SureCart::pages()->getId( 'checkout' );

		if ( empty( $checkout_page_id ) ) {
			return false;
		}

		return is_page( $checkout_page_id );
	}

	/**
	 * Check if the current page has a checkout form block.
	 *
	 * @return bool
	 */
	protected function hasCheckoutFormBlock(): bool {
		$post = get_post();

		if ( ! $post ) {
			return false;
		}

		return has_block( 'surecart/checkout-form', $post ) || has_block( 'surecart/form', $post );
	}

	/**
	 * Check if the current page is a buy page (product-specific checkout).
	 *
	 * @return bool
	 */
	protected function isBuyPage(): bool {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		return ! empty( $_GET['sc-buy'] ) || ! empty( get_query_var( 'sc-buy' ) );
	}

	/**
	 * Get SureCart vary cookies.
	 *
	 * @return array
	 */
	protected function getVaryCookies(): array {
		$cookies = [
			'sc_checkout_id', // Checkout session ID.
			'sc_customer_id', // Customer ID.
			'sc_order_id',    // Order ID.
		];

		/**
		 * Filter the SureCart cookies used for cache variation.
		 *
		 * @param array $cookies Array of cookie names.
		 */
		return apply_filters( 'surecart/cache/vary_cookies', $cookies );
	}

	/**
	 * Get scripts that should be excluded from JS defer.
	 *
	 * Core WordPress scripts like wp-api-fetch, wp-a11y, and wp-i18n are essential
	 * for dynamic functionality and accessibility. Deferring them can break SureCart
	 * checkout and other dynamic features.
	 *
	 * @return array Array of script patterns to exclude from defer.
	 */
	protected function getJsDeferExcludes(): array {
		$scripts = [
			'wp-api-fetch',   // /wp-includes/js/dist/api-fetch.min.js - Required for REST API calls.
			'wp-a11y',        // /wp-includes/js/dist/a11y.min.js - Required for accessibility.
			'wp-i18n',        // /wp-includes/js/dist/i18n.min.js - Required for translations.
			'wp-url',         // /wp-includes/js/dist/url.min.js - Required for URL handling.
			'dom-ready',      // /wp-includes/js/dist/dom-ready.min.js - Required for DOM ready handling.
			'wp-hooks',       // /wp-includes/js/dist/hooks.min.js - Required for WordPress hooks.
			'api-fetch',      // Alternative pattern.
			'a11y.min.js',
			'i18n.min.js',
			'url.min.js',
			'dom-ready.min.js',
			'hooks.min.js',
		];

		/**
		 * Filter the scripts excluded from JS defer.
		 *
		 * @param array $scripts Array of script patterns to exclude.
		 */
		return apply_filters( 'surecart/cache/js_defer_excludes', $scripts );
	}
}

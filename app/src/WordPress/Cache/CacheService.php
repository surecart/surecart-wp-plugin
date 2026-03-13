<?php

namespace SureCart\WordPress\Cache;

/**
 * Abstract Cache Service.
 */
abstract class CacheService {
	/**
	 * Bootstrap the service.
	 *
	 * @return void
	 */
	public function bootstrap() {
		// Early return if the cache plugin is not active.
		if ( ! $this->isCachePluginActive() ) {
			return;
		}

		// Disable cache for SureCart dynamic pages.
		add_action( 'wp', [ $this, 'maybeDisableCache' ] );

		// Disable cache for SureCart REST API requests.
		add_action( 'rest_api_init', [ $this, 'maybeDisableCacheForRestApi' ], 1 );

		// Purge cache when product stock is adjusted.
		add_action( 'surecart/product_stock_adjusted', [ $this, 'purgeProductCacheOnStockAdjustment' ] );
	}

	/**
	 * Disable cache for the current page.
	 *
	 * @param string $reason Reason for disabling cache.
	 * @return void
	 */
	abstract protected function disableCache( string $reason ): void;

	/**
	 * Check if the cache plugin is active.
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
	 * Disable both server-side and browser caching.
	 *
	 * @param string $reason Reason for disabling cache.
	 * @return void
	 */
	protected function disableCacheWithBrowserHeaders( string $reason ): void {
		// Disable server-side caching via the cache plugin.
		$this->disableCache( $reason );

		// Disable browser caching by sending no-cache headers.
		if ( ! headers_sent() ) {
			nocache_headers();
		}
	}

	/**
	 * Maybe disable cache for SureCart REST API requests.
	 *
	 * @return void
	 */
	public function maybeDisableCacheForRestApi() {
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
		$request_uri = isset( $_SERVER['REQUEST_URI'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REQUEST_URI'] ) ) : '';

		if ( strpos( $request_uri, '/surecart/' ) !== false && strpos( $request_uri, 'wp-json' ) !== false ) {
			return true;
		}

		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$rest_route = isset( $_GET['rest_route'] ) ? sanitize_text_field( wp_unslash( $_GET['rest_route'] ) ) : '';
		if ( strpos( $rest_route, '/surecart/' ) !== false ) {
			return true;
		}

		return false;
	}

	/**
	 * Purge product cache when stock is adjusted.
	 *
	 * @param \SureCart\Models\Product $product The product model.
	 * @return void
	 */
	public function purgeProductCacheOnStockAdjustment( $product ) {
		// Override in child classes if needed.
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
	 * Check if the current page is a buy page.
	 *
	 * @return bool
	 */
	protected function isBuyPage(): bool {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		return isset( $_GET['sc-buy'] ) || ! empty( get_query_var( 'sc-buy' ) );
	}

	/**
	 * Get SureCart vary cookies.
	 *
	 * @return array
	 */
	protected function getVaryCookies(): array {
		$cookies = [
			'sc_checkout_id',
			'sc_customer_id',
			'sc_order_id',
		];

		/**
		 * Filter the SureCart cookies used for cache variation.
		 *
		 * @param array $cookies Array of cookie names.
		 */
		return apply_filters( 'surecart/cache/vary_cookies', $cookies );
	}

	/**
	 * Get core WordPress scripts that should be excluded from JS defer.
	 *
	 * @return array
	 */
	protected function getJsDeferExcludes(): array {
		$scripts = [
			'wp-api-fetch',
			'wp-a11y',
			'wp-i18n',
			'wp-url',
			'dom-ready',
			'wp-hooks',
			'api-fetch',
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

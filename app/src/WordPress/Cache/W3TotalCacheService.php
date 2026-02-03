<?php

namespace SureCart\WordPress\Cache;

/**
 * W3 Total Cache Service.
 *
 * Handles W3 Total Cache integration for SureCart including:
 * - Excluding dynamic pages from caching (checkout, dashboard, cart)
 * - Excluding SureCart REST API requests from caching
 * - Purging cache on purchase events
 * - Excluding critical scripts from minification/defer
 */
class W3TotalCacheService extends CacheService {
	/**
	 * Bootstrap the service.
	 *
	 * @return void
	 */
	public function bootstrap() {
		parent::bootstrap();

		// Exclude critical WordPress scripts from minification.
		add_filter( 'w3tc_minify_js_do_tag_minification', [ $this, 'excludeScriptsFromMinify' ], 10, 3 );

		// Exclude SureCart scripts from defer.
		add_filter( 'w3tc_minify_js_script_tags', [ $this, 'excludeScriptsFromDefer' ] );
	}

	/**
	 * Check if W3 Total Cache plugin is active.
	 *
	 * @return bool
	 */
	protected function isCachePluginActive(): bool {
		return defined( 'W3TC' ) || function_exists( 'w3tc_flush_all' );
	}

	/**
	 * Disable cache for the current page.
	 *
	 * W3 Total Cache respects the DONOTCACHEPAGE constant.
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
		// Check if W3TC flush function exists.
		if ( ! function_exists( 'w3tc_flush_post' ) ) {
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
			w3tc_flush_post( $post_id );
		}

		/**
		 * Action fired after purging cache for a product on purchase.
		 *
		 * @param \SureCart\Models\Purchase $purchase The purchase model.
		 * @param mixed $product The product model.
		 */
		do_action( 'surecart/cache/purged_product', $purchase, $product );
	}

	/**
	 * Exclude critical scripts from W3TC minification.
	 *
	 * @param bool   $do_minification Whether to minify this script.
	 * @param string $script_tag      The script tag HTML.
	 * @param string $file            The script file URL.
	 * @return bool Whether to minify this script.
	 */
	public function excludeScriptsFromMinify( $do_minification, $script_tag, $file ) {
		if ( ! $do_minification ) {
			return $do_minification;
		}

		$excludes = $this->getJsDeferExcludes();

		foreach ( $excludes as $exclude ) {
			if ( strpos( $file, $exclude ) !== false || strpos( $script_tag, $exclude ) !== false ) {
				return false;
			}
		}

		return $do_minification;
	}

	/**
	 * Exclude critical scripts from W3TC defer.
	 *
	 * @param array $script_tags Array of script tags.
	 * @return array Modified script tags.
	 */
	public function excludeScriptsFromDefer( $script_tags ) {
		if ( ! \is_array( $script_tags ) ) {
			return $script_tags;
		}

		$excludes = $this->getJsDeferExcludes();

		foreach ( $script_tags as $key => $tag ) {
			foreach ( $excludes as $exclude ) {
				if ( strpos( $tag, $exclude ) !== false ) {
					// Add data-cfasync="false" or data-no-defer attribute to prevent deferring.
					$script_tags[ $key ] = str_replace( '<script', '<script data-no-defer="1"', $tag );
					break;
				}
			}
		}

		return $script_tags;
	}
}

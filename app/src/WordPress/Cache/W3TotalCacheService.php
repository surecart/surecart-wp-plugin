<?php

namespace SureCart\WordPress\Cache;

/**
 * W3 Total Cache Service.
 */
class W3TotalCacheService extends CacheService {
	/**
	 * Bootstrap the service.
	 *
	 * @return void
	 */
	public function bootstrap() {
		// Early return if W3 Total Cache plugin is not active.
		if ( ! $this->isCachePluginActive() ) {
			return;
		}

		parent::bootstrap();

		// Use W3TC's filter to prevent caching of SureCart pages.
		add_filter( 'w3tc_can_cache', [ $this, 'maybePreventCaching' ], 10, 2 );

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
	 * Prevent W3TC from caching SureCart dynamic pages.
	 *
	 * @param bool  $can_cache Whether W3TC can cache this page.
	 * @param mixed $page_grabber The W3TC page grabber object.
	 * @return bool
	 */
	public function maybePreventCaching( $can_cache, $page_grabber = null ) {
		// If already not caching, return early.
		if ( ! $can_cache ) {
			return $can_cache;
		}

		// Check if this is a SureCart page that should not be cached.
		if ( $this->shouldExcludeFromCache() ) {
			return false;
		}

		return $can_cache;
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

	/**
	 * Purge product cache when stock is adjusted.
	 *
	 * @param \SureCart\Models\Product $product The product model.
	 * @return void
	 */
	public function purgeProductCacheOnStockAdjustment( $product ) {
		// Check if W3TC flush function exists.
		if ( ! function_exists( 'w3tc_flush_post' ) ) {
			return;
		}

		if ( empty( $product ) ) {
			return;
		}

		// Get the WordPress post ID for the product.
		$post_id = $product->metadata->wp_id ?? null;

		if ( ! empty( $post_id ) ) {
			w3tc_flush_post( $post_id );
		}

		/**
		 * Action fired after purging cache for a product on stock adjustment.
		 *
		 * @param \SureCart\Models\Product $product The product model.
		 */
		do_action( 'surecart/cache/purged_product', $product );
	}

	/**
	 * Exclude critical scripts from W3TC minification.
	 *
	 * @param bool   $do_minification Whether to minify this script.
	 * @param string $script_tag The script tag HTML.
	 * @param string $file The script file URL.
	 * @return bool
	 */
	public function excludeScriptsFromMinify( $do_minification, $script_tag, $file ) {
		if ( ! $do_minification ) {
			return $do_minification;
		}

		foreach ( $this->getJsDeferExcludes() as $exclude ) {
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
	 * @return array
	 */
	public function excludeScriptsFromDefer( $script_tags ) {
		if ( ! is_array( $script_tags ) ) {
			return $script_tags;
		}

		foreach ( $script_tags as $key => $tag ) {
			foreach ( $this->getJsDeferExcludes() as $exclude ) {
				if ( strpos( $tag, $exclude ) !== false ) {
					$script_tags[ $key ] = preg_replace( '/^<script\b/', '<script data-no-defer="1"', $tag, 1 );
					break;
				}
			}
		}

		return $script_tags;
	}
}

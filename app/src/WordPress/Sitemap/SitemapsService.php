<?php

namespace SureCart\WordPress\Sitemap;

/**
 * Handles sitemapping for the plugin.
 */
class SitemapsService {
	/**
	 * Bootstrap the service.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_filter(
			'init',
			function() {
				// Remove the default product post type from the sitemap. We will add our own.
				add_filter( 'wp_sitemaps_post_types', [ $this, 'removeProductPostSiteMap' ] );

				wp_register_sitemap_provider( 'products', new ProductSiteMap() );
				wp_register_sitemap_provider( 'collections', new ProductCollectionSiteMap() );
			}
		);
	}

	/**
	 * Remove the product post type from the sitemap.
	 *
	 * @param array $post_types The post types.
	 * @return array
	 */
	public function removeProductPostSiteMap( array $post_types ): array {
		unset( $post_types['sc_product'] );

		return $post_types;
	}
}

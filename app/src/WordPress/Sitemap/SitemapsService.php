<?php

namespace SureCart\WordPress\Sitemap;

use SureCart\WordPress\Sitemap\ProductSiteMap;

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
				$provider = new ProductSiteMap();
				wp_register_sitemap_provider( 'products', $provider );
			}
		);
	}
}

<?php

namespace SureCart\WordPress\Sitemap;

use SureCart\WordPress\Sitemap\ProductSiteMap;

class SitemapsService {
	public function bootstrap() {
		add_filter(
			'init',
			function() {
				$provider = new ProductSiteMap();
				wp_register_sitemap_provider( 'surecart', $provider );
			}
		);
		// add_action( 'template_redirect', [ $this, 'sitemapsRedirect' ] );
	}


}

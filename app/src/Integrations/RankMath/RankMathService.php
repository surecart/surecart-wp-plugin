<?php

namespace SureCart\Integrations\RankMath;

/**
 * Controls the MemberPress integration.
 */
class RankMathService {
	/**
	 * Bootstrap the service.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_filter( 'rank_math/sitemap/providers', [ $this, 'addProviders' ] );
	}

	/**
	 * Add the providers.
	 *
	 * @param array $external_providers External providers.
	 *
	 * @return array
	 */
	public function addProviders( $external_providers ) {
		$external_providers['products']    = new ProductSiteMap();
		$external_providers['collections'] = new CollectionSiteMap();
		return $external_providers;
	}
}

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
	 * Append the provider if enabled.
	 *
	 * @param array                                $external_providers External providers.
	 * @param \RankMath\Sitemap\Providers\Provider $provider Provider.
	 * @param string                               $type Type.
	 *
	 * @return array
	 */
	private function appendIfEnabled( $external_providers, $provider, $type ) {
		if ( $provider->handles_type( 'sc_' . $type ) ) {
			$external_providers[ $type ] = $provider;
		}

		return $external_providers;
	}

	/**
	 * Add the providers.
	 *
	 * @param array $external_providers External providers.
	 *
	 * @return array
	 */
	public function addProviders( $external_providers ) {
		$external_providers = $this->appendIfEnabled( $external_providers, new ProductSiteMap(), 'product' );
		$external_providers = $this->appendIfEnabled( $external_providers, new CollectionSiteMap(), 'collection' );
		return $external_providers;
	}
}

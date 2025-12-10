<?php

namespace SureCart\Integrations\RankMath;

/**
 * Controls the Rank Math integration.
 */
class RankMathService {
	/**
	 * Bootstrap the Rank Math integration.
	 *
	 * @return void
	 */
	public function bootstrap(): void {
		add_filter( 'rank_math/frontend/robots', [ $this, 'addNoindexForQueryVars' ] );

		// Skip product model filter registration during sitemap generation to prevent memory exhaustion.
		add_filter( 'surecart/product/skip_filters', [ $this, 'skipFiltersOnSitemap' ] );
	}

	/**
	 * Modify robots to add noindex for SureCart query vars.
	 *
	 * @param array $robots Robots array.
	 *
	 * @return array Modified robots.
	 */
	public function addNoindexForQueryVars( array $robots ): array {
		if ( sc_has_no_index_query_vars() ) {
			return [
				'noindex'  => 'noindex',
				'nofollow' => 'nofollow',
			];
		}

		return $robots;
	}

	/**
	 * Skip model filters during sitemap generation.
	 *
	 * @param bool $skip Whether to skip filters.
	 *
	 * @return bool
	 */
	public function skipFiltersOnSitemap( $skip ): bool {
		if ( $skip ) {
			return $skip;
		}

		return $this->isSitemapRequest();
	}

	/**
	 * Check if current request is a sitemap request.
	 *
	 * @return bool
	 */
	private function isSitemapRequest(): bool {
		if ( isset( $_SERVER['REQUEST_URI'] ) ) {
			$uri = sanitize_text_field( wp_unslash( $_SERVER['REQUEST_URI'] ) );
			if ( false !== strpos( $uri, 'sitemap' ) && '.xml' === substr( $uri, -4 ) ) {
				return true;
			}
		}

		return false;
	}
}

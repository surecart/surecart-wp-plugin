<?php

namespace SureCart\Integrations\RankMath;

use SureCart\Integrations\Abstracts\NoIndexService;

/**
 * Controls the Rank Math integration.
 */
class RankMathService extends NoIndexService {
	/**
	 * The filter hook name for the robots meta.
	 *
	 * @var string
	 */
	protected $hook_name = 'rank_math/frontend/robots';

	/**
	 * The filter hook name for the robots meta.
	 *
	 * @var string
	 */
	public function bootstrap(): void {
		parent::bootstrap();

		// Skip product model filter registration during sitemap generation to prevent memory exhaustion.
		add_filter( 'surecart/product/skip_filters', [ $this, 'skipFiltersOnSitemap' ] );
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

<?php

namespace SureCart\Integrations\SEOPress;

use SureCart\Integrations\Abstracts\NoIndexService;

/**
 * Controls the SEOPress integration.
 */
class SEOPressService extends NoIndexService {
	/**
	 * The filter hook name for the robots meta.
	 *
	 * @var string
	 */
	protected $hook_name = 'seopress_titles_robots_attrs';

	/**
	 * Modify robots to add noindex for SureCart query vars.
	 * SEOPress uses indexed array format instead of associative.
	 *
	 * @param array $robots Robots array.
	 *
	 * @return array Modified robots.
	 */
	public function addNoindexForQueryVars( array $robots ): array {
		if ( ! $this->hasNoIndexQueryVars() ) {
			return $robots;
		}

		// Remove values that conflict with noindex/nofollow.
		// SEOPress adds 'index, follow' as a combined string.
		$robots = array_filter(
			$robots,
			function ( $value ) {
				// Skip non-string values.
				if ( ! is_string( $value ) ) {
					return true;
				}

				// Remove 'index, follow' combined string.
				if ( strpos( $value, 'index' ) !== false && strpos( $value, 'noindex' ) === false ) {
					return false;
				}

				// Remove standalone 'follow' (when noindex was set but nofollow wasn't).
				if ( 'follow' === $value ) {
					return false;
				}

				return true;
			}
		);

		// Re-index array after filtering.
		$robots = array_values( $robots );

		// Add noindex and nofollow.
		$robots[] = 'noindex';
		$robots[] = 'nofollow';

		return $robots;
	}
}

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
}

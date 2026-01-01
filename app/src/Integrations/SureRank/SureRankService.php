<?php

namespace SureCart\Integrations\SureRank;

/**
 * Controls the SureRank integration.
 */
class SureRankService {
	/**
	 * Bootstrap the SureRank integration.
	 *
	 * @return void
	 */
	public function bootstrap(): void {
		add_filter( 'surerank_robots_meta_array', [ $this, 'addNoindexForQueryVars' ] );
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

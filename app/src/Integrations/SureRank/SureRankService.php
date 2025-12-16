<?php

namespace SureCart\Integrations\SureRank;

use SureCart\Concerns\HasNoIndexRobots;

/**
 * Controls the SureRank integration.
 */
class SureRankService {
	use HasNoIndexRobots;

	/**
	 * Bootstrap the SureRank integration.
	 *
	 * @return void
	 */
	public function bootstrap(): void {
		add_filter( 'surerank_robots_meta_array', [ $this, 'addNoindexForQueryVars' ] );
	}
}

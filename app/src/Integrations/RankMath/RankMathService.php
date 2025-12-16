<?php

namespace SureCart\Integrations\RankMath;

use SureCart\Concerns\HasNoIndexRobots;

/**
 * Controls the Rank Math integration.
 */
class RankMathService {
	use HasNoIndexRobots;

	/**
	 * Bootstrap the Rank Math integration.
	 *
	 * @return void
	 */
	public function bootstrap(): void {
		add_filter( 'rank_math/frontend/robots', [ $this, 'addNoindexForQueryVars' ] );
	}
}

<?php

namespace SureCart\Integrations\RankMath;

use SureCart\Integrations\Contracts\NoIndexService;

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
}

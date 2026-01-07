<?php

namespace SureCart\Integrations\SureRank;

use SureCart\Integrations\Abstracts\NoIndexService;

/**
 * Controls the SureRank integration.
 */
class SureRankService extends NoIndexService {
	/**
	 * The filter hook name for the robots meta.
	 *
	 * @var string
	 */
	protected $hook_name = 'surerank_robots_meta_array';
}

<?php

namespace SureCart\Integrations\Yoast;

use SureCart\Integrations\Abstracts\NoIndexService;

/**
 * Controls the Yoast SEO integration.
 */
class YoastService extends NoIndexService {
	/**
	 * The filter hook name for the robots meta.
	 *
	 * @var string
	 */
	protected $hook_name = 'wpseo_robots_array';

	/**
	 * The noindex robots.
	 * Yoast uses boolean values instead of strings.
	 *
	 * @var array
	 */
	protected $noindex_robots = [
		'noindex'  => true,
		'nofollow' => true,
	];
}

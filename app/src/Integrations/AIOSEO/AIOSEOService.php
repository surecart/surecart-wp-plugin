<?php

namespace SureCart\Integrations\AIOSEO;

use SureCart\Integrations\Contracts\NoIndexService;

/**
 * Controls the All in One SEO integration.
 */
class AIOSEOService extends NoIndexService {
	/**
	 * The filter hook name for the robots meta.
	 *
	 * @var string
	 */
	protected $hook_name = 'aioseo_robots_meta';
}

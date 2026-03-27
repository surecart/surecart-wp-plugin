<?php

namespace SureCart\Integrations\TheSEOFramework;

use SureCart\Integrations\Abstracts\NoIndexService;

/**
 * Controls The SEO Framework integration.
 */
class TheSEOFrameworkService extends NoIndexService {
	/**
	 * The filter hook name for the robots meta.
	 *
	 * @var string
	 */
	protected $hook_name = 'the_seo_framework_robots_meta_array';
}

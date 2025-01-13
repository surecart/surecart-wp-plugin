<?php

namespace SureCart\Controllers\Admin\Settings;

/**
 * Controls the settings page.
 */
class Integrations extends BaseSettings {
	/**
	 * Dependencies.
	 *
	 * @var array
	 */
	protected $dependencies = [
		'suretriggers-sdk',
	];

	/**
	 * Script handles for pages
	 *
	 * @var array
	 */
	protected $scripts = [
		'show' => [ 'surecart/scripts/admin/integrations', 'admin/settings/integrations' ],
	];
}

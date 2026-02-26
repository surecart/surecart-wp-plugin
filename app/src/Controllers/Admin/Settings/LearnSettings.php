<?php

namespace SureCart\Controllers\Admin\Settings;

/**
 * Controls the Learn settings page.
 */
class LearnSettings extends BaseSettings {
	/**
	 * Script handles for pages
	 *
	 * @var array
	 */
	protected $scripts = [
		'show' => [ 'surecart/scripts/admin/learn', 'admin/settings/learn' ],
	];
}

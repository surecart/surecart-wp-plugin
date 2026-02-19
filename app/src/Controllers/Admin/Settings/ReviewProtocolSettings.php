<?php

namespace SureCart\Controllers\Admin\Settings;

use SureCart\Controllers\Admin\Settings\BaseSettings;

/**
 * Controls the settings page.
 */
class ReviewProtocolSettings extends BaseSettings {
	/**
	 * Script handles for pages.
	 *
	 * @var array
	 */
	protected $scripts = [
		'show' => [ 'surecart/scripts/admin/review-protocol', 'admin/settings/review-protocol' ],
	];
}

<?php

namespace SureCart\Controllers\Admin\Onboarding;

use SureCart\Support\Scripts\AdminModelEditController;

/**
 * Onboarding Page
 */
class OnboardingScriptsController extends AdminModelEditController {
	/**
	 * Script handle.
	 *
	 * @var string
	 */
	protected $handle = 'surecart/scripts/admin/onboarding';

	/**
	 * Script path.
	 *
	 * @var string
	 */
	protected $path = 'admin/onboarding';
}

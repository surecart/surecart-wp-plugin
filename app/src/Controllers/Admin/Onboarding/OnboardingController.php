<?php

namespace SureCart\Controllers\Admin\Onboarding;

/**
 * Handles onboarding http requests.
 */
class OnboardingController {
	/**
	 * Show the onboarding page.
	 *
	 * @return string
	 */
	public function show() {
		add_action( 'admin_enqueue_scripts', \SureCart::closure()->method( OnboardingScriptsController::class, 'enqueue' ) );

		// return view.
		return '<div id="app"></div>';
	}
}

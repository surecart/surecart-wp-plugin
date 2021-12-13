<?php

namespace CheckoutEngine\Controllers\Web;

use CheckoutEngine\Models\Subscription;
use CheckoutEngine\Models\User;

/**
 * Thank you routes
 */
class DashboardController {
	/**
	 * Show the dashboard
	 */
	public function show( $request, $view ) {
		// use original page view.
		return \CheckoutEngine::view( $view );
	}
}

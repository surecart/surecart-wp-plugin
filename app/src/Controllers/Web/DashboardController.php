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

	/**
	 * Login the user.
	 */
	public function login( $request ) {
		wp_verify_nonce( $request->query( 'nonce' ), "archive_$model_name" )

		return \CheckoutEngine::redirect()->to( $login_url );
	}
}

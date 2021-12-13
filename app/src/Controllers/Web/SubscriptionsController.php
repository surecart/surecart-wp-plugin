<?php

namespace CheckoutEngine\Controllers\Web;

/**
 * Thank you routes
 */
class SubscriptionsController {
	/**
	 * Show the user's subscriptions
	 */
	public function show( $request, $view ) {
		return \CheckoutEngine::view( $view );
	}
}

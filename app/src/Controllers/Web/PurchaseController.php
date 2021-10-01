<?php

namespace CheckoutEngine\Controllers\Web;

/**
 * Thank you routes
 */
class PurchaseController {
	/**
	 * Edit a product.
	 */
	public function show() {
		return \CheckoutEngine::view( 'web.purchased' );
	}
}

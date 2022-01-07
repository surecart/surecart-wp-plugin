<?php

namespace CheckoutEngine\Controllers\Admin\Abandoned;

use CheckoutEngine\Controllers\Admin\Abandoned\AbandonedOrderListTable;


/**
 * Handles product admin requests.
 */
class AbandonedOrderViewController {
	/**
	 * Orders index.
	 */
	public function index() {
		$table = new AbandonedOrderListTable();
		$table->prepare_items();
		return \CheckoutEngine::view( 'admin.abandoned-orders.index' )->with(
			[
				'table' => $table,
			]
		);
	}

	/**
	 * Coupons edit.
	 */
	public function edit() {
		return \CheckoutEngine::view( 'admin.orders.edit' );
	}

	public function archive( $request ) {
		// flash an error message
		\CheckoutEngine::flash()->add( 'errors', 'Please enter a valid email address.' );
		// redirect to order index page.
		return \CheckoutEngine::redirect()->to( \CheckoutEngine::getUrl()->index( 'order' ) );
	}
}

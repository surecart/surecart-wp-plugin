<?php

namespace CheckoutEngine\Controllers\Admin\Orders;

use CheckoutEngine\Controllers\Admin\Orders\OrdersListTable;

/**
 * Handles product admin requests.
 */
class OrdersViewController {
	/**
	 * Orders index.
	 */
	public function index() {
		$table = new OrdersListTable();
		$table->prepare_items();
		return \CheckoutEngine::view( 'admin.orders.index' )->with(
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

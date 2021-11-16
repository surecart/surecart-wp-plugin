<?php

namespace CheckoutEngine\Controllers\Admin\Subscriptions;

use CheckoutEngine\Controllers\Admin\Subscriptions\SubscriptionsListTable;

/**
 * Handles product admin requests.
 */
class SubscriptionsController {
	/**
	 * Orders index.
	 */
	public function index() {
		$table = new SubscriptionsListTable();
		$table->prepare_items();
		return \CheckoutEngine::view( 'admin.subscriptions.index' )->with(
			[
				'table' => $table,
			]
		);
	}

	/**
	 * Coupons edit.
	 */
	public function edit() {
		return \CheckoutEngine::view( 'admin.subscriptions.edit' );
	}
}

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
		return \CheckoutEngine::view( 'admin/abandoned-orders/index' )->with(
			[
				'table' => $table,
			]
		);
	}
}

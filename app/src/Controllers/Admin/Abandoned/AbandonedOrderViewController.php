<?php

namespace SureCart\Controllers\Admin\Abandoned;

use SureCart\Controllers\Admin\Abandoned\AbandonedOrderListTable;


/**
 * Handles product admin requests.
 */
class AbandonedOrderViewController {
	/**
	 * Orders index.
	 */
	public function index() {
		// TODO: when pro launches.
		$table = new AbandonedOrderListTable();
		$table->prepare_items();
		return \SureCart::view( 'admin/abandoned-orders/index' )->with(
			[
				'table' => $table,
			]
		);
	}
}

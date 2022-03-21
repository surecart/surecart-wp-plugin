<?php

namespace SureCart\Controllers\Admin;

use SureCart\Controllers\Admin\Tables\OrdersListTable;

/**
 * Handles product admin requests.
 */
class Orders {
	/**
	 * List product in a WP Table.
	 *
	 * @param [type] $request
	 * @param [type] $view
	 *
	 * @return void
	 */
	public function list( $request, $view ) {
		$table = new OrdersListTable();
		$table->prepare_items();
		return \SureCart::view( 'admin/orders/index' )->with( [ 'table' => $table ] );
	}
}

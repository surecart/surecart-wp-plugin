<?php

namespace CheckoutEngine\Controllers\Admin;

use CheckoutEngine\Controllers\Admin\Tables\CouponsListTable;

/**
 * Handles product admin requests.
 */
class Coupons {
	public function index( $request ) {
		$table = new CouponsListTable();
		$table->prepare_items();
		return \CheckoutEngine::view( 'admin.coupons.index' )->with( [ 'table' => $table ] );
	}
}

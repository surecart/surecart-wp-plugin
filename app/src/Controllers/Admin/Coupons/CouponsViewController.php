<?php

namespace CheckoutEngine\Controllers\Admin\Coupons;

use CheckoutEngine\Controllers\Admin\Tables\CouponsListTable;

/**
 * Handles product admin requests.
 */
class CouponsViewController {
	/**
	 * Coupons index.
	 */
	public function index() {
		$table = new CouponsListTable();
		$table->prepare_items();
		return \CheckoutEngine::view( 'admin.coupons.index' )->with( [ 'table' => $table ] );
	}

	/**
	 * Coupons edit.
	 */
	public function edit() {
		return \CheckoutEngine::view( 'admin.coupons.edit' );
	}
}

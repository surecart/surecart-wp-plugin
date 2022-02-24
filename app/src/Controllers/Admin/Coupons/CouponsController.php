<?php

namespace CheckoutEngine\Controllers\Admin\Coupons;

use CheckoutEngine\Controllers\Admin\Coupons\CouponsListTable;

/**
 * Handles product admin requests.
 */
class CouponsController {
	/**
	 * Coupons index.
	 */
	public function index() {
		$table = new CouponsListTable();
		$table->prepare_items();
		return \CheckoutEngine::view( 'admin/coupons/index' )->with(
			[
				'table' => $table,
			]
		);
	}

	/**
	 * Coupons edit.
	 */
	public function edit() {
		// enqueue needed script.
		add_action( 'admin_enqueue_scripts', \CheckoutEngine::closure()->method( CouponScriptsController::class, 'enqueue' ) );
		// return view.
		return '<div id="app"></div>';
	}
}

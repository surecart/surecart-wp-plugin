<?php

namespace SureCart\Controllers\Admin\Coupons;

use SureCart\Controllers\Admin\AdminController;
use SureCart\Controllers\Admin\Coupons\CouponsListTable;

/**
 * Handles product admin requests.
 */
class CouponsController extends AdminController {

	/**
	 * Coupons index.
	 */
	public function index() {
		$table = new CouponsListTable();
		$table->prepare_items();

		$this->withHeader(
			[
				'coupons' => [
					'title' => __( 'Coupons', 'surecart' ),
				],
			]
		);

		return \SureCart::view( 'admin/coupons/index' )->with(
			[
				'table' => $table,
			]
		);
	}

	/**
	 * Coupons edit.
	 */
	public function edit() {
		// admin edit page.
		do_action( 'surecart/admin/coupons/edit' );
		// enqueue needed script.
		add_action( 'admin_enqueue_scripts', \SureCart::closure()->method( CouponScriptsController::class, 'enqueue' ) );
		// return view.
		return '<div id="app"></div>';
	}
}

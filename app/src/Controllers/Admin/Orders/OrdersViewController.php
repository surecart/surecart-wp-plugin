<?php

namespace SureCart\Controllers\Admin\Orders;

use SureCart\Controllers\Admin\AdminController;
use SureCart\Controllers\Admin\Orders\OrdersListTable;

/**
 * Handles product admin requests.
 */
class OrdersViewController extends AdminController {
	/**
	 * Orders index.
	 */
	public function index() {
		$table = new OrdersListTable();
		$table->prepare_items();
		$this->withHeader(
			[
				'orders' => [
					'title' => __( 'Orders', 'surecart' ),
				],
			]
		);
		return \SureCart::view( 'admin/orders/index' )->with(
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
		add_action( 'admin_enqueue_scripts', \SureCart::closure()->method( OrderScriptsController::class, 'enqueue' ) );
		// return view.
		return '<div id="app"></div>';
	}

	public function archive( $request ) {
		// flash an error message
		\SureCart::flash()->add( 'errors', 'Please enter a valid email address.' );
		// redirect to order index page.
		return \SureCart::redirect()->to( \SureCart::getUrl()->index( 'order' ) );
	}
}

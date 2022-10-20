<?php

namespace SureCart\Controllers\Admin\Abandoned;

use SureCart\Controllers\Admin\Abandoned\AbandonedCheckoutListTable;


/**
 * Handles product admin requests.
 */
class AbandonedCheckoutViewController {
	/**
	 * Index.
	 */
	public function index() {
		$table = new AbandonedCheckoutListTable();
		$table->prepare_items();
		return \SureCart::view( 'admin/abandoned-orders/index' )->with(
			[
				'table' => $table,
			]
		);
	}

	/**
	 * Edit abandoned order.
	 */
	public function edit() {
		// enqueue needed script.
		add_action( 'admin_enqueue_scripts', \SureCart::closure()->method( AbandonedCheckoutScriptsController::class, 'enqueue' ) );
		// return view.
		return '<div id="app"></div>';
	}
}

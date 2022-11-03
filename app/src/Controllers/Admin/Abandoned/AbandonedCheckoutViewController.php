<?php

namespace SureCart\Controllers\Admin\Abandoned;

use SureCart\Controllers\Admin\Abandoned\AbandonedCheckoutListTable;
use SureCart\Controllers\Admin\AdminController;

/**
 * Handles product admin requests.
 */
class AbandonedCheckoutViewController extends AdminController {
	/**
	 * Index.
	 */
	public function index() {
		// enqueue stats.
		add_action( 'admin_enqueue_scripts', \SureCart::closure()->method( AbandonedCheckoutStatsScriptsController::class, 'enqueue' ) );

		$this->withHeader(
			[
				'orders' => [
					'title' => __( 'Abandoned Checkouts', 'surecart' ),
				],
			]
		);

		$table = new AbandonedCheckoutListTable();
		$table->prepare_items();
		return \SureCart::view( 'admin/abandoned-orders/index' )->with(
			[
				'table'   => $table,
				'enabled' => false, // \SureCart::account()->entitlements->abandoned_checkouts ?? false,
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

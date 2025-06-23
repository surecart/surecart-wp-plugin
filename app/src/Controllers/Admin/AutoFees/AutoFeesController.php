<?php

namespace SureCart\Controllers\Admin\AutoFees;

use SureCart\Controllers\Admin\AdminController;
use SureCart\Controllers\Admin\AutoFees\AutoFeesListTable;
use SureCart\Controllers\Admin\AutoFees\AutoFeesScriptsController;

/**
 * Handles product admin requests.
 */
class AutoFeesController extends AdminController {
	/**
	 * Orders index.
	 */
	public function index() {
		$table = new AutoFeesListTable();
		$table->prepare_items();
		$this->withHeader(
			array(
				'breadcrumbs' => [
					'auto_fee' => [
						'title' => __( 'Auto Fees & Discounts', 'surecart' ),
					],
				],
				'report_url'       => SURECART_REPORTS_URL . 'subscriptions',
			)
		);

		return \SureCart::view( 'admin/auto-fees/index' )->with(
			[
				'table' => $table,
			]
		);
	}

	/**
	 * Edit
	 *
	 * @return string
	 */
	public function edit( $request ) {
		// enqueue needed script.
		add_action( 'admin_enqueue_scripts', \SureCart::closure()->method( AutoFeesScriptsController::class, 'enqueue' ) );

		$this->preloadPaths(
			[
				'/wp/v2/users/me',
				'/wp/v2/types?context=view',
				'/wp/v2/types?context=edit',
				'/surecart/v1/auto_fees/' . $request->query( 'id' ) . '?context=edit',
			]
		);

		// return view.
		return '<div id="app"></div>';
	}
}

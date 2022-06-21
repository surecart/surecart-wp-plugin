<?php

namespace SureCart\Controllers\Admin\Subscriptions;

use SureCart\Controllers\Admin\AdminController;
use SureCart\Controllers\Admin\Subscriptions\SubscriptionsListTable;
use SureCart\Controllers\Admin\Subscriptions\Scripts\EditScriptsController;
use SureCart\Controllers\Admin\Subscriptions\Scripts\ShowScriptsController;

/**
 * Handles product admin requests.
 */
class SubscriptionsController extends AdminController {
	/**
	 * Orders index.
	 */
	public function index() {
		$table = new SubscriptionsListTable();
		$table->prepare_items();
		$this->withHeader(
			[
				'subscriptions' => [
					'title' => __( 'Subscriptions', 'surecart' ),
				],
			]
		);
		return \SureCart::view( 'admin/subscriptions/index' )->with(
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
	public function edit() {
		// enqueue needed script.
		add_action( 'admin_enqueue_scripts', \SureCart::closure()->method( EditScriptsController::class, 'enqueue' ) );
		// return view.
		return '<div id="app"></div>';
	}

	/**
	 * Show
	 *
	 * @return string
	 */
	public function show() {
		// enqueue needed script.
		add_action( 'admin_enqueue_scripts', \SureCart::closure()->method( ShowScriptsController::class, 'enqueue' ) );
		// return view.
		return '<div id="app"></div>';
	}
}

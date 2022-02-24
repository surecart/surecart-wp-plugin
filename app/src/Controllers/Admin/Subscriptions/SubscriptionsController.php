<?php

namespace CheckoutEngine\Controllers\Admin\Subscriptions;

use CheckoutEngine\Controllers\Admin\Subscriptions\SubscriptionsListTable;
use CheckoutEngine\Controllers\Admin\Subscriptions\Scripts\EditScriptsController;
use CheckoutEngine\Controllers\Admin\Subscriptions\Scripts\ShowScriptsController;

/**
 * Handles product admin requests.
 */
class SubscriptionsController {
	/**
	 * Orders index.
	 */
	public function index() {
		$table = new SubscriptionsListTable();
		$table->prepare_items();
		return \CheckoutEngine::view( 'admin/subscriptions/index' )->with(
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
		add_action( 'admin_enqueue_scripts', \CheckoutEngine::closure()->method( EditScriptsController::class, 'enqueue' ) );
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
		add_action( 'admin_enqueue_scripts', \CheckoutEngine::closure()->method( ShowScriptsController::class, 'enqueue' ) );
		// return view.
		return '<div id="app"></div>';
	}
}

<?php

namespace SureCart\Controllers\Admin\SubscriptionCancellations;

use SureCart\Controllers\Admin\SubscriptionCancellations\SubscriptionCancellationsListTable;
use SureCart\Controllers\Admin\AdminController;

/**
 * Handles product admin requests.
 */
class SubscriptionCancellationsController extends AdminController {
	/**
	 * Index.
	 */
	public function index() {
		// enqueue stats.
		// add_action( 'admin_enqueue_scripts', \SureCart::closure()->method( AbandonedCheckoutStatsScriptsController::class, 'enqueue' ) );

		$this->withHeader(
			[
				'orders' => [
					'title' => __( 'Subscription Cancellations', 'surecart' ),
				],
			]
		);

		$table = new SubscriptionCancellationsListTable();
		$table->prepare_items();
		return \SureCart::view( 'admin/subscription-cancellations/index' )->with(
			[
				'table'   => $table,
				'enabled' => false,
			]
		);
	}

	/**
	 * Edit abandoned order.
	 */
	public function edit() {
		// enqueue needed script.
		add_action( 'admin_enqueue_scripts', \SureCart::closure()->method( SubscriptionCancellationsScriptsController::class, 'enqueue' ) );
		// return view.
		return '<div id="app"></div>';
	}
}

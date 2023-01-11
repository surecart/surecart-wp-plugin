<?php

namespace SureCart\Controllers\Admin\CancellationInsights;

use SureCart\Controllers\Admin\CancellationInsights\CancellationInsightsListTable;
use SureCart\Controllers\Admin\AdminController;

/**
 * Handles product admin requests.
 */
class CancellationInsightsController extends AdminController {
	/**
	 * Index.
	 */
	public function index() {
		// enqueue stats.
		add_action( 'admin_enqueue_scripts', \SureCart::closure()->method( CancellationInsightsScriptsController::class, 'enqueue' ) );

		$this->withHeader(
			[
				'subscriptions' => [
					'title' => __( 'Subscription Saver & Insights', 'surecart' ),
				],
			]
		);

		$table = new CancellationInsightsListTable();
		$table->prepare_items();
		return \SureCart::view( 'admin/cancellation-insights/index' )->with(
			[
				'table'   => $table,
				'enabled' => \SureCart::account()->entitlements->subscription_preservation ?? false,
			]
		);
	}
}

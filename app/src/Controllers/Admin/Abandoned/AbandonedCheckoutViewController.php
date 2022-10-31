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

		$entitlements = \SureCart::account()->entitlements;

		if ( empty( $entitlements->abandoned_checkouts ) ) {
			wp_enqueue_style( 'surecart-themes-default' );
			wp_enqueue_script( 'surecart-components' );

			return \SureCart::view( 'admin/abandoned-orders/cta-banner' )->toString();
		} else {
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
					'table' => $table,
				]
			);
		}
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

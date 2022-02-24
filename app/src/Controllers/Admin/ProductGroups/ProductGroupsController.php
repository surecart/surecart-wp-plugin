<?php

namespace CheckoutEngine\Controllers\Admin\ProductGroups;

/**
 * Handles product admin requests.
 */
class ProductGroupsController {
	/**
	 * Orders index.
	 */
	public function index() {
		$table = new ProductGroupsListTable();
		$table->prepare_items();
		return \CheckoutEngine::view( 'admin/product-groups/index' )->with(
			[
				'table' => $table,
			]
		);
	}

	/**
	 * Show
	 */
	public function show() {
		// enqueue needed script.
		add_action( 'admin_enqueue_scripts', \CheckoutEngine::closure()->method( ProductGroupsScriptsController::class, 'enqueue' ) );
		// return view.
		return '<div id="app"></div>';
	}
}

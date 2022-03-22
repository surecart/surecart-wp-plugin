<?php

namespace SureCart\Controllers\Admin\ProductGroups;

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
		return \SureCart::view( 'admin/product-groups/index' )->with(
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
		add_action( 'admin_enqueue_scripts', \SureCart::closure()->method( ProductGroupsScriptsController::class, 'enqueue' ) );
		// return view.
		return '<div id="app"></div>';
	}
}

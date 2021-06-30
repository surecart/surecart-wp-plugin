<?php

namespace CheckoutEngine\Controllers\Admin;

use CheckoutEngine\Controllers\Admin\ProductsListTable;

/**
 * Handles product admin requests.
 */
class Products {
	/**
	 * List product in a WP Table.
	 *
	 * @param [type] $request
	 * @param [type] $view
	 *
	 * @return void
	 */
	public function list( $request, $view ) {
		$table = new ProductsListTable();
		$table->prepare_items();
		return \CheckoutEngine::view( 'admin.products.index' )->with( [ 'table' => $table ] );
	}
}

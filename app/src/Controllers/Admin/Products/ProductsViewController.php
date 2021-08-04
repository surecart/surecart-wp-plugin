<?php

namespace CheckoutEngine\Controllers\Admin\Products;

use CheckoutEngine\Models\Product;
use CheckoutEngine\Controllers\Admin\Products\ProductsListTable;

/**
 * Handles product admin requests.
 */
class ProductsViewController {

	/**
	 * Get the product query
	 *
	 * @param \WPEmerge\Requests\Request $request Request.
	 *
	 * @return string
	 */
	public function getProductQuery( \WPEmerge\Requests\Request $request ) {
		$params = $request->getQueryParams();
		return ! empty( $params['product'] ) ? $params['product'] : null;
	}

	public function index( $request ) {
		$table = new ProductsListTable();
		$table->prepare_items();
		return \CheckoutEngine::view( 'admin.products.index' )->with( [ 'table' => $table ] );
	}

	public function edit( $request ) {
		return \CheckoutEngine::view( 'admin.products.edit' );
	}
}

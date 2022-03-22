<?php

namespace SureCart\Controllers\Admin;

use SureCart\Controllers\Admin\Products\ProductsListTable;
use SureCart\Models\Product;

/**
 * Handles product admin requests.
 */
class Products {

	/**
	 * Get the product query
	 *
	 * @param \SureCartCore\Requests\Request $request Request.
	 *
	 * @return string
	 */
	public function getProductQuery( \SureCartCore\Requests\Request $request ) {
		$params = $request->getQueryParams();
		return ! empty( $params['product'] ) ? $params['product'] : null;
	}

	/**
	 * List product in a WP Table.
	 *
	 * @param \SureCartCore\Requests\Request $request
	 *
	 * @return void
	 */
	public function page( $request ) {
		$product = $this->getProductQuery( $request );
		$args    = func_get_args();
		return call_user_func_array( [ $this, $product ? 'show' : 'index' ], $args );
	}

	public function index( $request ) {
		$table = new ProductsListTable();
		$table->prepare_items();
		return \SureCart::view( 'admin/orders/index' )->with( [ 'table' => $table ] );
	}

	public function show( $request ) {
		$product = $this->getProductQuery( $request );
		$product = Product::find( $product );

		return \SureCart::view( 'admin/products/show' )->with( [ 'product' => $product ] );
	}
}

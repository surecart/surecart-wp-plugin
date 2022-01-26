<?php

namespace CheckoutEngine\Controllers\Admin;

use CheckoutEngine\Controllers\Admin\Products\ProductsListTable;
use CheckoutEngine\Models\Product;

/**
 * Handles product admin requests.
 */
class Products {

	/**
	 * Get the product query
	 *
	 * @param \CheckoutEngineCore\Requests\Request $request Request.
	 *
	 * @return string
	 */
	public function getProductQuery( \CheckoutEngineCore\Requests\Request $request ) {
		$params = $request->getQueryParams();
		return ! empty( $params['product'] ) ? $params['product'] : null;
	}

	/**
	 * List product in a WP Table.
	 *
	 * @param \CheckoutEngineCore\Requests\Request $request
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
		return \CheckoutEngine::view( 'admin/orders/index' )->with( [ 'table' => $table ] );
	}

	public function show( $request ) {
		$product = $this->getProductQuery( $request );
		$product = Product::find( $product );

		return \CheckoutEngine::view( 'admin/products/show' )->with( [ 'product' => $product ] );
	}
}

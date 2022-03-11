<?php

namespace CheckoutEngine\Controllers\Rest;

use CheckoutEngine\Models\Product;

/**
 * Handle Product requests through the REST API
 */
class ProductsController extends RestController {
	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = Product::class;

	/**
	 * Purge the product image
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response
	 */
	public function purgeImage( \WP_REST_Request $request ) {
		$product = new $this->class( [ 'id' => $request['id'] ] );

		return $product->where( $request->get_query_params() )->purgeImage( array_diff_assoc( $request->get_params(), $request->get_query_params() ) );
	}

	/**
	 * Purge a product file
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response
	 */
	public function purgeFile( \WP_REST_Request $request ) {
		$product = new $this->class( [ 'id' => $request['id'] ] );

		return $product->where( $request->get_query_params() )->purgeFile( $request['file_id'] );
	}
}

<?php

namespace SureCart\Controllers\Rest;

use SureCart\Models\Product;

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
	 * Edit model.
	 *
	 * Filter out variations which statuses are draft.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function edit( \WP_REST_Request $request ) {
		// Stop if we are not editing a variable product.
		if ( empty( $request['variants'] ) ) {
			return parent::edit( $request );
		}

		// Filter draft variations.
		$request['variants'] = array_filter(
			$request['variants'],
			function( $variation ) {
				$variation_status = $variation['status'] ?? 'publish';
				return 'draft' !== $variation_status;
			}
		);

		return parent::edit( $request );
	}
}

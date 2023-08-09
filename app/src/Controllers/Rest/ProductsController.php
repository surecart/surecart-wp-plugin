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
	 * Run some middleware to run before request.
	 *
	 * @param \SureCart\Models\Model $class Model class instance.
	 * @param \WP_REST_Request       $request Request object.
	 *
	 * @return \SureCart\Models\Model
	 */
	protected function middleware( $class, \WP_REST_Request $request ) {
		// if we are in edit context, we want to fetch the variants and variant options.
		if ( 'edit' === $request->get_param( 'context' ) || in_array( $request->get_method(), [ 'POST', 'PUT', 'PATCH', 'DELETE' ] ) ) {
			$class->with( [ 'variants', 'variant_options', 'product_collections' ] );
		}

		return parent::middleware( $class, $request );
	}
}

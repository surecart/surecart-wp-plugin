<?php

namespace SureCart\Controllers\Rest;

use SureCart\Concerns\RestrictsAnonymousReads;
use SureCart\Models\Price;
use SureCart\Models\Product;

/**
 * Handle Price requests through the REST API
 */
class PricesController extends RestController {
	use RestrictsAnonymousReads;

	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = Price::class;

	/**
	 * Capability that unlocks unrestricted reads.
	 *
	 * @var string
	 */
	protected $edit_capability = 'edit_sc_prices';

	/**
	 * Expands safe to forward for anonymous callers.
	 *
	 * @var array
	 */
	protected $anonymous_expands = [ 'product' ];

	/**
	 * Query filters forced for anonymous callers.
	 *
	 * Archived prices stay readable on find — grandfathered subscriptions
	 * reference them on the customer dashboard.
	 *
	 * @var array
	 */
	protected $anonymous_scope = [ 'archived' => false ];

	/**
	 * Controller-specific middleware hook, run after the anonymous restriction.
	 *
	 * @param \SureCart\Models\Model $class Model class instance.
	 * @param \WP_REST_Request       $request Request object.
	 *
	 * @return \SureCart\Models\Model
	 */
	protected function catalogMiddleware( $class, \WP_REST_Request $request ) {
		// get the expands from the product for syncing.
		$expands = array_merge( [ 'product' ], array_map( fn( $expand ) => strpos( $expand, '.' ) !== false ? $expand : 'product.' . $expand, Product::getSyncExpands() ) );
		// If we are updating or creating, always return the product for syncing.
		if ( in_array( $request->get_method(), [ 'POST', 'PUT', 'PATCH', 'DELETE' ] ) ) {
			$class->with( array_unique( array_filter( array_merge( $expands, $request['expand'] ?? [] ) ) ) );
		}
		return $class;
	}

	/**
	 * Duplicate model.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function duplicate( \WP_REST_Request $request ) {
		$model = $this->middleware( new $this->class(), $request );
		if ( is_wp_error( $model ) ) {
			return $model;
		}
		return $model->duplicate( $request['id'] );
	}
}

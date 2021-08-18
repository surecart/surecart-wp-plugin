<?php

namespace CheckoutEngine\Controllers\Rest;

use CheckoutEngine\Models\Coupon;
use CheckoutEngine\Models\Promotion;

/**
 * Handle coupon requests through the REST API
 */
class PromotionsController {
	/**
	 * Create price
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response
	 */
	public function create( \WP_REST_Request $request ) {
		return rest_ensure_response( Promotion::create( $request->get_params() ) );
	}

	/**
	 * Price index
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response
	 */
	public function index( \WP_REST_Request $request ) {
		return rest_ensure_response(
			Promotion::where(
				[
					'active' => $request['active'] ?? null,
					'ids'    => $request['ids'] ?? null,
				]
			)->get()
		);
	}

	/**
	 * Get Price
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response
	 */
	public function find( \WP_REST_Request $request ) {
		return rest_ensure_response( Promotion::find( $request['id'] ) );
	}

	/**
	 * Edit a promotion.
	 *
	 * @param \WP_REST_Request $request
	 *
	 * @return void
	 */
	public function edit( \WP_REST_Request $request ) {
		return rest_ensure_response( Promotion::update( $request->get_params() ) );
	}

	/**
	 * Delete a promotion.
	 *
	 * @param \WP_REST_Request $request
	 *
	 * @return void
	 */
	public function delete( \WP_REST_Request $request ) {
		return rest_ensure_response( Promotion::delete( $request['id'] ) );
	}
}

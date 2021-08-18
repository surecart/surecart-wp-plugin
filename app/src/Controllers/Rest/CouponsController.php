<?php

namespace CheckoutEngine\Controllers\Rest;

use CheckoutEngine\Models\Coupon;

/**
 * Handle coupon requests through the REST API
 */
class CouponsController extends RestController {
	/**
	 * Create price
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function create( \WP_REST_Request $request ) {
		return rest_ensure_response( Coupon::create( $request->get_params() ) );
	}

	/**
	 * Price index
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function index( \WP_REST_Request $request ) {
		return rest_ensure_response(
			Coupon::where(
				[
					'active' => $request['active'] ?? null,
					'ids'    => $request['ids'] ?? null,
				]
			)->get()
		);
	}

	/**
	 * Find model.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function find( \WP_REST_Request $request ) {
		return rest_ensure_response( Coupon::find( $request['id'] ) );
	}

	/**
	 * Edit model.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function edit( \WP_REST_Request $request ) {
		return rest_ensure_response( Coupon::update( $request->get_params() ) );
	}

	/**
	 * Delete model.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function delete( \WP_REST_Request $request ) {
		return rest_ensure_response( Coupon::delete( $request['id'] ) );
	}
}

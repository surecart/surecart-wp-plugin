<?php

namespace CheckoutEngine\Controllers\Rest;

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
		// first create a coupon.
		$coupon = Promotion::create( $request );

		if ( is_wp_error( $coupon ) ) {
			return $coupon;
		}

		$promotion = Promotion::create(
			[
				'code'      => $request['code'],
				'coupon_id' => $request['coupon_id'],
			]
		);

		return rest_ensure_response( $promotion );
	}

	/**
	 * Price index
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response
	 */
	public function index( \WP_REST_Request $request ) {
		$prices = Promotion::where(
			[
				'active' => $request['active'] ?? null,
				'ids'    => $request['ids'] ?? null,
			]
		)->get();

		if ( is_wp_error( $prices ) ) {
			return $prices;
		}

		return rest_ensure_response( $prices );
	}

	/**
	 * Get Price
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response
	 */
	public function find( \WP_REST_Request $request ) {
		$coupon = Promotion::find( $request['id'] );

		if ( is_wp_error( $coupon ) ) {
			return $coupon;
		}

		return rest_ensure_response( $coupon );
	}

	public function edit( \WP_REST_Request $request ) {
	}

	public function delete( \WP_REST_Request $request ) {
	}
}

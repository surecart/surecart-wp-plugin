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
		// first, create the coupon.
		$coupon = Coupon::create( $request->get_param( 'coupon' ) );

		// then create the promotion for the coupon.
		$promotion = Promotion::create( array_merge( $request->get_params(), [ 'coupon_id' => $coupon->id ] ) );

		if ( is_wp_error( $promotion ) ) {
			return $promotion;
		}

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

	/**
	 * Edit a promotion.
	 *
	 * @param \WP_REST_Request $request
	 *
	 * @return void
	 */
	public function edit( \WP_REST_Request $request ) {

		return rest_ensure_response( $request['coupon'] );
		// update coupon if nested.
		if ( ! empty( $request['coupon'] ) ) {
			$coupon = Coupon::update( $request['coupon'] );
		}

		if ( is_wp_error( $coupon ) ) {
			return $coupon;
		}

		// update promotion.
		$promotion = Promotion::update( $request->get_params() );

		if ( is_wp_error( $promotion ) ) {
			return $promotion;
		}

		return rest_ensure_response( $promotion->toArray() );
	}

	public function delete( \WP_REST_Request $request ) {
	}
}

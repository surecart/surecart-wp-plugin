<?php

namespace CheckoutEngine\Controllers\Rest;

use CheckoutEngine\Models\Price;

/**
 * Handle price requests through the REST API
 */
class PriceController {
	/**
	 * Create price
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response
	 */
	public function create( \WP_REST_Request $request ) {
		$price = Price::create();

		if ( is_wp_error( $price ) ) {
			return $price;
		}

		return rest_ensure_response( $price );
	}

	/**
	 * Price index
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response
	 */
	public function index( \WP_REST_Request $request ) {
		$prices = Price::where(
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
	public function get( \WP_REST_Request $request ) {
		$price = Price::get( $request['id'] );

		if ( is_wp_error( $price ) ) {
			return $price;
		}

		return rest_ensure_response( $price );
	}

	public function edit( \WP_REST_Request $request ) {
	}

	public function delete( \WP_REST_Request $request ) {
	}
}

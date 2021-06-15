<?php

namespace CheckoutEngine\Controllers\Rest;

use CheckoutEngine\Models\Price;

/**
 * Handle price requests through the REST API
 */
class PriceController {
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
}

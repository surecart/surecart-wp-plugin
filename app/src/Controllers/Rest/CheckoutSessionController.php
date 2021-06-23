<?php

namespace CheckoutEngine\Controllers\Rest;

use CheckoutEngine\Models\CheckoutSession;

/**
 * Handle price requests through the REST API
 */
class CheckoutSessionController {
	/**
	 * Get a session
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response
	 */
	public function get( \WP_REST_Request $request ) {
		$session = CheckoutSession::get( $request['id'] );

		if ( is_wp_error( $session ) ) {
			return $session;
		}

		return rest_ensure_response( $session );
	}

	/**
	 * Get a session
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response
	 */
	public function create( \WP_REST_Request $request ) {
		$args = wp_parse_args(
			$request,
			[
				'currency' => 'usd',
			]
		);

		$session = CheckoutSession::create(
			[
				'checkout_session' => $args,
			]
		);

		if ( is_wp_error( $session ) ) {
			return $session;
		}

		return rest_ensure_response( $session );
	}
}

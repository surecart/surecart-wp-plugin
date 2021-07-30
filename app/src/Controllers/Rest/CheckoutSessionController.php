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

		$session = CheckoutSession::create( $args );

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
	public function finalize( \WP_REST_Request $request ) {
		$args = wp_parse_args(
			$request->get_body_params(),
			[]
		);

		// do any validations here.

		// don't send with request.
		if ( $args['processor_type'] ) {
			unset( $args['processor_type'] );
		}

		$session  = new CheckoutSession( $args, $request['processor_type'] );
		$prepared = $session->prepare();

		if ( is_wp_error( $prepared ) ) {
			return $prepared;
		}

		return rest_ensure_response( $prepared );
	}

	/**
	 * Get a session
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response
	 */
	public function update( \WP_REST_Request $request ) {
		$session = CheckoutSession::update( $request->get_params() );

		if ( is_wp_error( $session ) ) {
			return $session;
		}

		return rest_ensure_response( $session );
	}
}

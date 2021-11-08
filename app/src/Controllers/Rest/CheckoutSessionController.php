<?php

namespace CheckoutEngine\Controllers\Rest;

use CheckoutEngine\Support\Errors;
use CheckoutEngine\Models\CheckoutSession;

/**
 * Handle price requests through the REST API
 */
class CheckoutSessionController extends RestController {
	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = CheckoutSession::class;

	/**
	 * Get a session
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response
	 */
	public function finalize( \WP_REST_Request $request ) {
		$args = $request->get_body_params();

		// allow 3rd party validations on fields.
		$errors = apply_filters( 'checkout_engine/checkout/validate', $args );

		if ( ! empty( $errors ) ) {
			$error = [
				'code'              => 'invalid',
				'message'           => __( 'Whoops! Something is not quite right.', 'checkout_engine' ),
				'validation_errors' => $errors,
			];
			return Errors::formatAndTranslate( $error, 422 );
		}

		// don't send with request.
		if ( ! empty( $args['processor_type'] ) ) {
			unset( $args['processor_type'] );
		}

		$session = new CheckoutSession( $args, $request['processor_type'] );
		return $session->finalize();
	}
}

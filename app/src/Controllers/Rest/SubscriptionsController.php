<?php

namespace CheckoutEngine\Controllers\Rest;

use CheckoutEngine\Models\Subscription;

/**
 * Handle Price requests through the REST API
 */
class SubscriptionsController extends RestController {
	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = Subscription::class;

	/**
	 * Cancel a subscription.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response
	 */
	public function cancel( \WP_REST_Request $request ) {
		$args = $request->get_body_params();

		// allow 3rd party validations on fields.
		$errors = apply_filters( 'checkout_engine/subscription/cancel/validate', $args );

		if ( ! empty( $errors ) ) {
			$error = [
				'code'              => 'invalid',
				'message'           => __( 'Whoops! Something is not quite right.', 'checkout_engine' ),
				'validation_errors' => $errors,
			];
			return \CheckoutEngine::errors()->translate( $error, 422 );
		}

		return Subscription::cancel();
	}
}

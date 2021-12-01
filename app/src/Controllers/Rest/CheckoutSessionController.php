<?php

namespace CheckoutEngine\Controllers\Rest;

use CheckoutEngine\Support\Errors;
use CheckoutEngine\Models\CheckoutSession;
use CheckoutEngine\Models\Form;

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
	 * Set the mode of the request before we run it.
	 * We get this from the saved form
	 *
	 * @param \CheckoutEngine\Models\Model $class Model class instance.
	 * @param \WP_REST_Request             $request Request object.
	 *
	 * @return \CheckoutEngine\Models\Model
	 */
	protected function middleware( \CheckoutEngine\Models\Model $class, \WP_REST_Request $request ) {
		$mode = isset( $request['form_id'] ) ? $this->getFormMode( $request['form_id'] ) : 'live';
		$class->setMode( apply_filters( 'checkout_engine/request/mode', $mode ?? 'live', $request ) );
		return $class;
	}

	/**
	 * Get the form mode
	 *
	 * @param integer $id ID of the form.
	 * @return string Mode of the form.
	 */
	public function getFormMode( $id ) {
		return Form::getMode( (int) $id );
	}

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
			return \CheckoutEngine::errors()->translate( $error, 422 );
		}

		// don't send with request.
		if ( ! empty( $args['processor_type'] ) ) {
			unset( $args['processor_type'] );
		}

		$session = new CheckoutSession( $args, $request['processor_type'] );
		return $session->finalize();
	}
}

<?php

namespace CheckoutEngine\Controllers\Rest;

use CheckoutEngine\Support\Errors;
use CheckoutEngine\Models\CheckoutSession;
use CheckoutEngine\Models\Form;
use CheckoutEngine\Models\User;

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
	 * Middleware before we make the request.
	 *
	 * @param \CheckoutEngine\Models\Model $class Model class instance.
	 * @param \WP_REST_Request             $request Request object.
	 *
	 * @return \CheckoutEngine\Models\Model|\WP_Error
	 */
	protected function middleware( \CheckoutEngine\Models\Model $class, \WP_REST_Request $request ) {
		$class = $this->setMode( $class, $request );
		if ( is_wp_error( $class ) ) {
			return $class;
		}
		$class = $this->maybeSetUser( $class, $request );
		return $class;
	}

	/**
	 * Let's set the customer's email and name if they are already logged in.
	 *
	 * @param \CheckoutEngine\Models\Model $class Model class instance.
	 * @param \WP_REST_Request             $request Request object.
	 *
	 * @return \CheckoutEngine\Models\Model|\WP_Error
	 */
	protected function maybeSetUser( \CheckoutEngine\Models\Model $class, \WP_REST_Request $request ) {
		// we only care about new sessions for now.
		if ( $request->get_method() !== 'POST' ) {
			return $class;
		}

		// get current user.
		$user = User::current();

		// must be logged in.
		if ( ! $user ) {
			return $class;
		}

		// if the name or email is already set, don't overwrite it.
		if ( ! empty( $request['name'] ) && ! empty( $request['email'] ) ) {
			return $class;
		}

		// fetch the user's customer object.
		$customer = $user->customer();

		$class['email'] = $customer->email ?? $user->user_email;
		$class['name']  = $customer->name ?? $user->display_name;

		return $class;
	}

	/**
	 * We run middleware to make sure the form is in "Test" mode
	 * if a test payment is requested. This prevents the spamming of any
	 * forms on your site that are not in test mode.
	 *
	 * @param \CheckoutEngine\Models\Model $class Model class instance.
	 * @param \WP_REST_Request             $request Request object.
	 *
	 * @return \CheckoutEngine\Models\Model|\WP_Error
	 */
	protected function setMode( \CheckoutEngine\Models\Model $class, \WP_REST_Request $request ) {
		$mode = 'live';
		if ( false === $request['live_mode'] && ! current_user_can( 'edit_pk_checkout_sessions' ) ) {
			$mode = isset( $request['form_id'] ) ? $this->getFormMode( $request['form_id'] ) : 'live';
			if ( 'test' !== $mode ) {
				return new \WP_Error( 'invalid_mode', 'The form is set to live mode, but the request is for test mode.', [ 'status' => 400 ] );
			}
			$mode = 'test';
		}
		return $class->setMode( apply_filters( 'checkout_engine/request/mode', $mode, $request ) );
	}

	/**
	 * Get the form mode
	 *
	 * @param integer $id ID of the form.
	 * @return string Mode of the form.
	 */
	protected function getFormMode( $id ) {
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
		$args = $request->get_params();

		// allow 3rd party validations on fields.
		$errors = $this->validate( $args, $request );

		if ( ! empty( $errors ) ) {
			$error = [
				'code'              => 'invalid',
				'message'           => __( 'Whoops! Something is not quite right.', 'checkout_engine' ),
				'validation_errors' => $errors,
			];
			return \CheckoutEngine::errors()->translate( $error, 422 );
		}

		$session = new $this->class( [ 'id' => $request['id'] ] );
		return $session->setProcessor( $request['processor_type'] )
			->where( $request->get_query_params() )
			->finalize( array_diff_assoc( $request->get_params(), $request->get_query_params() ) );
	}

	/**
	 * Validate the form.
	 *
	 * @param array  $args Arguments.
	 * @param object $request Request.
	 * @return array Errors.
	 */
	public function validate( $args, $request ) {
		return apply_filters( 'checkout_engine/checkout/validate', [], $args, $request );
	}
}

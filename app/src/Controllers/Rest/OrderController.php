<?php

namespace CheckoutEngine\Controllers\Rest;

use CheckoutEngine\Support\Errors;
use CheckoutEngine\Models\Order;
use CheckoutEngine\Models\Form;
use CheckoutEngine\Models\User;

/**
 * Handle price requests through the REST API
 */
class OrderController extends RestController {
	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = Order::class;

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

		// fetch the user's customer object.
		$customer = $user->customer();

		if ( ! empty( $customer->id ) ) {
			$class['customer'] = $customer->id;
		}

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
		if ( false === $request['live_mode'] && ! current_user_can( 'edit_ce_orders' ) ) {
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
	 * Finalize an order.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response
	 */
	public function finalize( \WP_REST_Request $request ) {
		$args = $request->get_params();

		// allow 3rd party validations on fields.
		$errors = $this->validate( $args, $request );

		// return early if errors.
		if ( $errors->has_errors() ) {
			return $errors;
		}

		$order           = new $this->class( [ 'id' => $request['id'] ] );
		$finalized_order = $order->setProcessor( $request['processor_type'] )
			->where( $request->get_query_params() )
			->finalize( array_diff_assoc( $request->get_params(), $request->get_query_params() ) );

		return $finalized_order;
	}

	/**
	 * Validate the form.
	 *
	 * @param array  $args Arguments.
	 * @param object $request Request.
	 * @return \WP_Error Errors.
	 */
	public function validate( $args, $request ) {
		$errors = new \WP_Error();

		// validate email/password.
		if ( $request->get_param( 'password' ) && $request->get_param( 'email' ) ) {
			$user = $this->createOrLoginUser( $request->get_param( 'email' ), $request->get_param( 'name' ), $request->get_param( 'password' ) );
			if ( is_wp_error( $user ) ) {
				$errors->add( $user->get_error_code(), $user->get_error_message() );
			}
		}

		return apply_filters( 'checkout_engine/checkout/validate', $errors, $args, $request );
	}

	/**
	 * Create or login the user.
	 *
	 * @param string $user_email Username.
	 * @param string $user_name User email.
	 * @param string $password User password.
	 * @return \WP_Error|true
	 */
	protected function createOrLoginUser( $user_email, $user_name, $password ) {
		if ( empty( $password ) || empty( $user_email ) ) {
			return;
		}

		// user exists, try signing in with password.
		$user = get_user_by( 'email', $user_email );

		// if there's a user, try to sign them in with the password.
		if ( false !== $user ) {
			$user = wp_signon(
				[
					'user_login'    => $user_email,
					'user_password' => $password,
				]
			);
			return is_wp_error( $user ) ? $user : true;
		}

		// otherwise, create the user with the info.
		$user = User::create(
			[
				'user_name'     => empty( $user_name ) ? $user_name : $user_email,
				'user_email'    => $user_email,
				'user_password' => $password,
			]
		);

		if ( is_wp_error( $user ) ) {
			return $user;
		}

		$user->login();

		return ! empty( $user->ID ) ? true : new \WP_Error( 'error', __( 'Could not create the user.', 'checkout_engine' ) );
	}
}

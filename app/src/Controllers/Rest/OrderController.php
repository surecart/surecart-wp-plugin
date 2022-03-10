<?php

namespace CheckoutEngine\Controllers\Rest;

use CheckoutEngine\Models\Order;
use CheckoutEngine\Models\Form;
use CheckoutEngine\Models\User;
use CheckoutEngine\WordPress\Users\CustomerLinkService;

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
		return $class;
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

		// return early if errors.
		if ( is_wp_error( $finalized_order ) ) {
			return $finalized_order;
		}

		// link the customer id to the user.
		$linked = $this->linkCustomerId( $finalized_order, $request );
		if ( is_wp_error( $linked ) ) {
			return $linked;
		}

		// maybe login the user if a password is sent.
		$login = $this->maybeLoginUser( $request->get_param( 'email' ), $request->get_param( 'password' ) );
		if ( is_wp_error( $login ) ) {
			return $login;
		}

		// finalize the order.
		return $finalized_order;
	}

	/**
	 * Link the customer id to the order.
	 *
	 * @param \CheckoutEngine\Models\Order $order Order model.
	 * @return \WP_User|\WP_Error
	 */
	public function linkCustomerId( $order, $request ) {
		$service = new CustomerLinkService( $order, $request->get_param( 'password' ) );
		return $service->link();
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

		// check if they are trying to sign in.
		$valid_login = $this->maybeValidateLoginCreds( $request->get_param( 'email' ), $request->get_param( 'password' ) );
		if ( is_wp_error( $valid_login ) ) {
			$errors->add( $valid_login->get_error_code(), $valid_login->get_error_message() );
		}

		return apply_filters( 'checkout_engine/checkout/validate', $errors, $args, $request );
	}

	/**
	 * Check if the user is trying to sign in.
	 * If so, validate credentials before finalizing.
	 *
	 * @param string $email Email.
	 * @param string $password Password.
	 *
	 * @return true|\WP_Error
	 */
	public function maybeValidateLoginCreds( $email = '', $password = '' ) {
		// check if the person is signing in using a password and sign them in.
		if ( $password && $email ) {
			// user exists, try signing in with password.
			$user = get_user_by( 'email', $email );
			// if there's a user, check the username and password before we submit the order.
			if ( false !== $user ) {
				return wp_authenticate_username_password( null, $user->user_login, $password );
			}
		}
		return true;
	}

	/**
	 * Create or login the user.
	 *
	 * @param string $user_email Username.
	 * @param string $password User password.
	 * @return \WP_Error|true
	 */
	protected function maybeLoginUser( $user_email, $password = '' ) {
		if ( empty( $password ) ) {
			return;
		}
		return wp_signon(
			[
				'user_login'    => $user_email,
				'user_password' => $password,
			]
		);
	}
}

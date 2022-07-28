<?php

namespace SureCart\Controllers\Rest;

use SureCart\Models\Checkout;
use SureCart\Models\Form;
use SureCart\Models\User;
use SureCart\WordPress\Users\CustomerLinkService;

/**
 * Handle price requests through the REST API
 */
class CheckoutsController extends RestController {
	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = Checkout::class;

	/**
	 * Middleware before we make the request.
	 *
	 * @param \SureCart\Models\Model $class Model class instance.
	 * @param \WP_REST_Request       $request Request object.
	 *
	 * @return \SureCart\Models\Model|\WP_Error
	 */
	protected function middleware( $class, \WP_REST_Request $request ) {
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
	 * @param \SureCart\Models\Model $class Model class instance.
	 * @param \WP_REST_Request       $request Request object.
	 *
	 * @return \SureCart\Models\Model|\WP_Error
	 */
	protected function maybeSetUser( \SureCart\Models\Model $class, \WP_REST_Request $request ) {
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
		$customer = $user->customerId( ! empty( $request['live_mode'] ) ? 'live' : 'test' );

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
	 * @param \SureCart\Models\Model $class Model class instance.
	 * @param \WP_REST_Request       $request Request object.
	 *
	 * @return \SureCart\Models\Model|\WP_Error
	 */
	protected function setMode( \SureCart\Models\Model $class, \WP_REST_Request $request ) {
		$mode = 'live';
		if ( false === $request['live_mode'] && ! current_user_can( 'edit_sc_orders' ) ) {
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
	 * @return \SureCart\Models\Order|\WP_Error
	 */
	public function finalize( \WP_REST_Request $request ) {
		$args = $request->get_params();

		// allow 3rd party validations on fields.
		$errors = $this->validate( $args, $request );

		// return early if errors.
		if ( $errors->has_errors() ) {
			return $errors;
		}

		$order     = new $this->class( [ 'id' => $request['id'] ] );
		$finalized = $order->setProcessor( $request['processor_type'] )
			->where( $request->get_query_params() )
			->finalize( array_diff_assoc( $request->get_params(), $request->get_query_params() ) );

		// bail if error.
		if ( is_wp_error( $finalized ) ) {
			return $finalized;
		}

		// the order is paid (probably because of a coupon). Link the customer.
		$linked = $this->maybeLinkCustomer( $finalized, $request );
		if ( is_wp_error( $linked ) ) {
			return $linked;
		}

		// return the order.
		return $finalized;
	}

	/**
	 * Link the customer if the order status is paid only.
	 *
	 * @param \SureCart\Models\Order $order
	 * @param \WP_REST_Request       $request
	 *
	 * @return \SureCart\Models\Order|\WP_Error
	 */
	public function maybeLinkCustomer( $order, $request ) {
		if ( 'paid' !== $order->status ) {
			return false;
		}
		return $this->linkCustomerId( $order, $request );
	}

	/**
	 * Confirm an order.
	 *
	 * This force-fetches the order from the API and
	 * creates/syncs a WordPress user account if paid.
	 *
	 * @param \WP_REST_Request $request  Rest Request.
	 *
	 * @return \SureCart\Models\Order|\WP_Error
	 */
	public function confirm( \WP_REST_Request $request ) {
		$order = $this->middleware( new $this->class(), $request );
		if ( is_wp_error( $order ) ) {
			return $order;
		}

		$order = $order->where(
			array_merge(
				$request->get_query_params(),
				[ 'refresh_status' => true ] // Important: This will force syncing with the processor.
			)
		)->with(
			[
				'purchases', // Important: we need to make sure we expand the purchase to provide access.
			]
		)->find( $request['id'] );

		if ( is_wp_error( $order ) ) {
			return $order;
		}

		if ( 'paid' !== $order->status ) {
			return new \WP_Error( 'invalid_status', 'The order is not paid.', [ 'status' => 400 ] );
		}

		// link the customer id to the user.
		$linked = $this->maybeLinkCustomer( $order, $request );
		if ( is_wp_error( $linked ) ) {
			return $linked;
		}

		// purchase created.
		if ( ! empty( $order->purchases->data ) ) {
			foreach ( $order->purchases->data as $purchase ) {
				if ( empty( $purchase->revoked ) ) {
					// broadcast the webhook.
					do_action( 'surecart/purchase_created', $purchase );
				}
			}
		}

		// the order is confirmed.
		do_action( 'surecart/order_confirmed', $order, $request );

		// return the order.
		return $order;
	}

	/**
	 * Link the customer id to the order.
	 *
	 * @param \SureCart\Models\Order $order Order model.
	 * @param \WP_REST_Request       $request Request object.
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

		return apply_filters( 'surecart/checkout/validate', $errors, $args, $request );
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

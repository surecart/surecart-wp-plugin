<?php

namespace SureCart\Controllers\Rest;

use SureCart\Models\Checkout;
use SureCart\Models\Form;
use SureCart\Models\User;
use SureCart\WordPress\Users\CustomerLinkService;
use SureCart\WordPress\RecaptchaValidationService;

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
	 * Edit model.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function edit( \WP_REST_Request $request ) {
		// if we have a password, hash it and set it in a transient.
		// we need to do this because some processors will redirect and we will lose this form data.
		if ( ! empty( $request->get_param( 'password' ) ) ) {
			set_transient( 'sc_checkout_password_hash_' . $request['id'], wp_hash_password( $request->get_param( 'password' ) ), DAY_IN_SECONDS );
		}

		// edit the checkout.
		$response = parent::edit( $request );

		// check if the email exists and set on record.
		if ( apply_filters( 'surecart/checkout/finduser', true ) ) {
			if ( ! empty( $response->email ) ) {
				$response->email_exists = (bool) email_exists( $response->email );
			}
		}

		return $response;
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
	 * Manually pay an order.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \SureCart\Models\Checkout|\WP_Error
	 */
	public function manuallyPay( \WP_REST_Request $request ) {
		$checkout = $this->middleware( new $this->class( $request['id'] ), $request );
		if ( is_wp_error( $checkout ) ) {
			return $checkout;
		}

		if ( ! empty( $this->with ) ) {
			$checkout = $checkout->with( $this->with );
		}

		$paid = $checkout->where( $request->get_query_params() )->manuallyPay();

		// purchase created.
		if ( ! empty( $paid->purchases->data ) ) {
			foreach ( $paid->purchases->data as $purchase ) {
				if ( empty( $purchase->revoked ) ) {
					// broadcast the webhook.
					do_action( 'surecart/purchase_created', $purchase );
				}
			}
		}
		return $paid;
	}

	/**
	 * Finalize an order.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \SureCart\Models\Checkout|\WP_Error
	 */
	public function finalize( \WP_REST_Request $request ) {
		$args = $request->get_params();

		// validate form fields and password input.
		$errors = $this->validate( $args, $request );

		// return early if errors.
		if ( $errors->has_errors() ) {
			return $errors;
		}

		// finalize the order.
		$checkout  = new $this->class( [ 'id' => $request['id'] ] );
		$finalized = $checkout->where( $request->get_query_params() )
			->finalize( $request->get_body_params() );

		// bail if error.
		if ( is_wp_error( $finalized ) ) {
			return $finalized;
		}

		// return the order.
		return $finalized;
	}

	/**
	 * Confirm an order.
	 *
	 * This force-fetches the order from the API, runs any automations
	 * and creates the user account tied to the customer.
	 *
	 * @param \WP_REST_Request $request  Rest Request.
	 *
	 * @return \SureCart\Models\Checkout|\WP_Error
	 */
	public function confirm( \WP_REST_Request $request ) {
		$checkout = $this->middleware( new $this->class(), $request );
		if ( is_wp_error( $checkout ) ) {
			return $checkout;
		}

		$checkout = $checkout->where(
			array_merge(
				$request->get_query_params(),
				[ 'refresh_status' => true ] // Important: Do not remove. This will force syncing with the processor.
			)
		)->with(
			[
				'purchases', // Important: we need to make sure we expand the purchase to provide access.
				'customer', // Important: we need to use this to create the WP User with the same info.
			]
		)->find( $request['id'] );

		// bail if error.
		if ( is_wp_error( $checkout ) ) {
			return $checkout;
		}

		// Create a user account for the customer.
		$linked = $this->linkCustomerId( $checkout );
		if ( is_wp_error( $linked ) ) {
			return $linked;
		}

		// purchase created.
		if ( ! empty( $checkout->purchases->data ) ) {
			foreach ( $checkout->purchases->data as $purchase ) {
				if ( empty( $purchase->revoked ) ) {
					// broadcast the webhook.
					do_action( 'surecart/purchase_created', $purchase );
				}
			}
		}

		// the order is confirmed.
		do_action( 'surecart/checkout_confirmed', $checkout, $request );

		// return the order.
		return $checkout;
	}

	/**
	 * Link the customer id to the order.
	 *
	 * @param \SureCart\Models\Checkout $checkout Checkout model.
	 * @return \WP_User|\WP_Error
	 */
	public function linkCustomerId( $checkout ) {
		// get transient.
		$password_hash = get_transient( 'sc_checkout_password_hash_' . $checkout->id );
		// delete transient.
		delete_transient( 'sc_checkout_password_hash_' . $checkout->id );
		// link customer.
		$service = new CustomerLinkService( $checkout, $password_hash );
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

		// Check if honeypot checkbox checked or not.
		$metadata = $request->get_param( 'metadata' );
		if ( $metadata && ! empty( $metadata['get_feedback'] ) ) {
			$errors->add( 'invalid', __( 'Invalid request. Please try again.', 'surecart' ) );
		}

		// check recaptcha.
		$service = new RecaptchaValidationService();
		if ( $service->isEnabled() ) {
			$recaptcha = $service->validate( $request->get_param( 'grecaptcha' ) );
			if ( is_wp_error( $recaptcha ) ) {
				$errors->add( $recaptcha->get_error_code(), $recaptcha->get_error_message() );
			}
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

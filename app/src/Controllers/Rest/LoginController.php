<?php

namespace SureCart\Controllers\Rest;

use SureCart\Models\User;

/**
 * Handle coupon requests through the REST API
 */
class LoginController extends RestController {
	/**
	 * Login user.
	 *
	 * @param \WP_REST_Request $request The REST request object.
	 *
	 * @return array|\WP_Error Returns an array with user details on success, or WP_Error on failure.
	 */
	public function authenticate( \WP_REST_Request $request ) {
		// Authenticate the user.
		$user = wp_authenticate( $request->get_param( 'login' ), $request->get_param( 'password' ) );

		if ( is_wp_error( $user ) ) {
			return $user;
		}

		$sc_user = User::find( $user->ID );
		$sc_user->login();

		$redirect_to  = $request->get_param( 'redirect_to' );
		$redirect_url = ! empty( $redirect_to ) ? wp_validate_redirect( $redirect_to, false ) : null;

		// Fetch customer data with shipping address for auto-fill at checkout.
		$mode     = $request->get_param( 'checkout_mode' ) ?? 'live';
		$customer = $sc_user->customer( $mode, [ 'shipping_address' ] );

		$customer_data = [];
		if ( $customer && ! is_wp_error( $customer ) ) {
			$customer_data = [
				'first_name'       => $customer->first_name ?? $user->display_name ?? $user->user_login,
				'last_name'        => $customer->last_name ?? '',
				'phone'            => $customer->phone ?? '',
				'shipping_address' => $customer->shipping_address ?? [],
			];
		} else {
			$customer_data = [
				'first_name'       => $user->display_name ?? $user->user_login,
				'last_name'        => '',
				'phone'            => '',
				'shipping_address' => [],
			];
		}

		return [
			'name'         => $user->display_name,
			'email'        => $user->user_email,
			'customer'     => $customer_data,
			'redirect_url' => apply_filters( 'sc_login_redirect_url', $redirect_url ),
			'nonce'        => ( wp_installing() && ! is_multisite() ) ? '' : wp_create_nonce( 'wp_rest' ),
		];
	}

	/**
	 * Logout user
	 *
	 * @param \WP_REST_Request $request Request object.
	 *
	 * @return array Returns an array with a new nonce for future requests.
	 */
	public function logout( \WP_REST_Request $request ) {
		wp_logout();

		return [
			'nonce' => ( wp_installing() && ! is_multisite() ) ? '' : wp_create_nonce( 'wp_rest' ),
		];
	}
}

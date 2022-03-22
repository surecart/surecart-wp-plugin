<?php

namespace SureCart\Controllers\Rest;

/**
 * Handle coupon requests through the REST API
 */
class LoginController extends RestController {
	/**
	 * Login user
	 *
	 * @return Model
	 */
	public function authenticate( \WP_REST_Request $request ) {
		$user = wp_signon(
			[
				'user_login'    => $request->get_param( 'login' ),
				'user_password' => $request->get_param( 'password' ),
			]
		);

		if ( is_wp_error( $user ) ) {
			return $user;
		}

		$redirect = $request->get_param( 'redirect_url' );

		return [ 'redirect_url' => $redirect ?? \SureCart::pages()->url( 'dashboard' ) ];
	}
}

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

		return [
			'name'         => $user->display_name,
			'email'        => $user->user_email,
			'redirect_url' => $request->get_param( 'redirect_url' ),
		];
	}
}

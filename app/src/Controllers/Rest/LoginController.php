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
		// Authenticate the user
		$user = wp_authenticate( $request->get_param( 'login' ), $request->get_param( 'password' ) );
		// flush all caches.
		wp_cache_flush();
		
		if ( is_wp_error( $user ) ) {
			return $user;
		}

		// Set the current user
		wp_set_current_user( $user->ID );
		wp_set_auth_cookie( $user->ID );

		return [
			'name'         => $user->display_name,
			'email'        => $user->user_email,
			'redirect_url' => $request->get_param( 'redirect_url' ),
		];
	}
}

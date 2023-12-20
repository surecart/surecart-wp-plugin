<?php

namespace SureCart\Controllers\Rest;

/**
 * Handle coupon requests through the REST API
 */
class LoginController extends RestController {
	/**
	 * Login user.
	 *
	 * @param WP_REST_Request $request The REST request object.
	 *
	 * @return array|\WP_Error Returns an array with user details on success, or WP_Error on failure.
	 */
	public function authenticate( \WP_REST_Request $request ) {
		// Authenticate the user.
		$user = wp_authenticate( $request->get_param( 'login' ), $request->get_param( 'password' ) );

		// Flush all caches.
		wp_cache_flush();

		if ( is_wp_error( $user ) ) {
			return $user;
		}

		// Set the current user.
		clean_user_cache( $user->ID );
		wp_clear_auth_cookie();
		wp_set_current_user( $user->ID );
		wp_set_auth_cookie( $user->ID, true, false );
		update_user_caches( $user->getUser() );

		return [
			'name'         => $user->display_name,
			'email'        => $user->user_email,
			'redirect_url' => $request->get_param( 'redirect_url' ),
		];
	}
}

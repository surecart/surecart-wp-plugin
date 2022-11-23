<?php

namespace SureCart\Controllers\Rest;

/**
 * Handle login with code requests through the REST API
 */
class LoginWithCodeController extends RestController {
	/**
	 * Login user
	 *
	 * @return Model
	 */
	public function authenticate( \WP_REST_Request $request ) {
        $user = get_user_by( 'email', $request->get_param( 'login' ) );

		// flush all caches.
		wp_cache_flush();

		if ( is_wp_error( $user ) ) {
			return $user;
		}

        wp_clear_auth_cookie();
        wp_set_current_user( $user->ID );
        wp_set_auth_cookie( $user->ID );

		return [
			'name'         => $user->display_name,
			'email'        => $user->user_email,
			'redirect_url' => $request->get_param( 'redirect_url' ),
		];
	}
}

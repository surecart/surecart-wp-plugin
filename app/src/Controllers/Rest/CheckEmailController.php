<?php

namespace SureCart\Controllers\Rest;

/**
 * Handle check email requests through the REST API
 */
class CheckEmailController extends RestController {
	/**
	 * Check login.
	 *
	 * @param \WP_REST_Request $request The REST request.
	 *
	 * @return true|\WP_Error
	 */
	public function checkEmail( \WP_REST_Request $request ) {
		$login = $request->get_param( 'login' ) ?? '';
		// handle email.
		if ( strpos( $login, '@' ) !== false ) {
			$user = get_user_by( 'email', $login );
			return $user ? true : new \WP_Error(
				'invalid_email',
				__( 'There is no account with that username or email address.', 'surecart' )
			);
		}

		// check for login.
		$user = get_user_by( 'login', $login );

		return $user ? true : new \WP_Error(
			'invalid_username',
			sprintf(
					/* translators: %s: User name. */
				__( 'The username <strong>%s</strong> is not registered on this site. If you are unsure of your username, try your email address instead.', 'surecart' ),
				esc_html( $login )
			)
		);
	}
}

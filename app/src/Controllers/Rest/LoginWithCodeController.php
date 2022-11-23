<?php

namespace SureCart\Controllers\Rest;

/**
 * Handle login with code requests through the REST API
 */
class LoginWithCodeController extends RestController {
    /**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'verification_codes/verify';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'verification_code';

	/**
	 * Login user
	 *
	 * @return Model
	 */
	public function verify( \WP_REST_Request $request ) {
        $verify = \SureCart::request(
			$this->endpoint,
			[
				'method' => 'POST',
				'query'  => $this->query,
				'body'   => [
					$this->object_name => json_decode( wp_json_encode( $request->get_params ), true ),
				],
			]
		);

		if ( is_wp_error( $verify ) ) {
			return $verify;
		}

        if ( empty( $verify->verified ) ) {
			return;
		}

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
			'redirect_url' => site_url( '/customer-dashboard' ),
		];
	}
}

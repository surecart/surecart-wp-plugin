<?php

namespace SureCart\Controllers\Rest;

/**
 * Handle check email requests through the REST API
 */
class CheckEmailController extends RestController {
	/**
	 * Check email user
	 *
	 * @return Model
	 */
	public function checkEmail( \WP_REST_Request $request ) {
		$user = email_exists( $request->get_param( 'login' ) ) ? true : false;

		// flush all caches.
		wp_cache_flush();

        return [
			'check_email' => $user,
		];
	}
}

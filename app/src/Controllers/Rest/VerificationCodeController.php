<?php

namespace SureCart\Controllers\Rest;

use SureCart\Models\User;
use SureCart\Models\VerificationCode;

/**
 * Handle coupon requests through the REST API
 */
class VerificationCodeController extends RestController {
	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = VerificationCode::class;

	/**
	 * Verify a verification code
	 *
	 * @param \WP_REST_Request $request  Rest Request.
	 *
	 * @return \SureCart\Models\VerificationCode|\WP_Error
	 */
	public function verify( \WP_REST_Request $request ) {
		$model = $this->middleware( new $this->class(), $request );
		if ( is_wp_error( $model ) ) {
			return $model;
		}
		$verify = $model->where( $request->get_query_params() )->verify( array_diff_assoc( $request->get_params(), $request->get_query_params() ) );

		if ( is_wp_error( $verify ) ) {
			return $verify;
		}

		if ( empty( $verify->verified ) ) {
			return new \WP_Error( 'invalid_code', __( 'Invalid verification code', 'surecart' ) );
		}

		$user = User::get_user_by( 'email', $request->get_param( 'login' ) );

		if ( ! $user ) {
			return new \WP_Error( 'user_not_found', __( 'The user could not be found.', 'surecart' ) );
		}

		// login the user.
		$user->login();

		// return the model.
		return $verify;
	}
}

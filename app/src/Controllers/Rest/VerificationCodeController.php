<?php

namespace SureCart\Controllers\Rest;

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
		return $model->where( $request->get_query_params() )->verify( array_diff_assoc( $request->get_params(), $request->get_query_params() ) );
	}
}

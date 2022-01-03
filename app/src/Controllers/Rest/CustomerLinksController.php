<?php

namespace CheckoutEngine\Controllers\Rest;

use CheckoutEngine\Models\CustomerLink;

/**
 * Handle Price requests through the REST API
 */
class CustomerLinksController extends RestController {
	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = CustomerLink::class;

	/**
	 * Create model.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function create( \WP_REST_Request $request ) {
		$model = $this->middleware( new $this->class(), $request );
		if ( is_wp_error( $model ) ) {
			return $model;
		}

		$user = get_user_by( 'email', $request->get_param( 'email' ) );
		if ( ! $user ) {
			return new \WP_Error( 'invalid_email', 'Invalid email address.', [ 'status' => 400 ] );
		}

		// override email.
		$request['email'] = $user->user_email;

		return $model->where( $request->get_query_params() )->create( array_diff_assoc( $request->get_params(), $request->get_query_params() ) );
	}
}

<?php

namespace CheckoutEngine\Controllers\Rest;

use CheckoutEngine\Models\Account;

/**
 * Handle price requests through the REST API
 */
class SettingsController {
	/**
	 * Index
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response
	 */
	public function index( \WP_REST_Request $request ) {
		$account  = Account::where( $request->get_query_params() )->find();
		$settings = [];
		return rest_ensure_response( array_merge( $account->toArray(), $settings ) );
	}

	/**
	 * Update
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response
	 */
	public function update( \WP_REST_Request $request ) {
		$settings = [];
		$settings = apply_filters( 'checkout_engine/rest/settings/update', $settings, $request->get_params(), $request );
		return rest_ensure_response( $settings );
	}
}

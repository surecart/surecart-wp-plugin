<?php

namespace SureCart\Controllers\Rest;

use SureCart\Models\AutoFeeProtocol;

/**
 * Handle coupon requests through the REST API
 */
class AutoFeeProtocolController {
	/**
	 * Find model.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function find( \WP_REST_Request $request ) {
		return AutoFeeProtocol::find();
	}

	/**
	 * Edit model.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function edit( \WP_REST_Request $request ) {
		return AutoFeeProtocol::update( $request->get_json_params() );
	}
}

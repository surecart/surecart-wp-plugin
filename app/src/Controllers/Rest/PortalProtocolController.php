<?php

namespace SureCart\Controllers\Rest;

use SureCart\Models\PortalProtocol;

/**
 * Handle Price requests through the REST API
 */
class PortalProtocolController {
	/**
	 * Find model.
	 *
	 * @return Model
	 */
	public function find( \WP_REST_Request $request ) {
		return PortalProtocol::find();
	}

	/**
	 * Edit model.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function edit( \WP_REST_Request $request ) {
		return PortalProtocol::update( array_diff_assoc( $request->get_params(), $request->get_query_params() ) );
	}
}

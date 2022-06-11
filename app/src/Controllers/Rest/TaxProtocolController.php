<?php

namespace SureCart\Controllers\Rest;

use SureCart\Models\TaxProtocol;

/**
 * Handle coupon requests through the REST API
 */
class TaxProtocolController {
	/**
	 * Find model.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function find( \WP_REST_Request $request ) {
		return TaxProtocol::with( [ 'address', 'ca_tax_identifier', 'eu_tax_identifier' ] )->find();
	}

	/**
	 * Edit model.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function edit( \WP_REST_Request $request ) {
		return TaxProtocol::with( [ 'address', 'ca_tax_identifier', 'eu_tax_identifier' ] )->update( array_diff_assoc( $request->get_params(), $request->get_query_params() ) );
	}
}

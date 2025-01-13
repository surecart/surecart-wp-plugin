<?php

namespace SureCart\Controllers\Rest;

use SureCart\Models\IntegrationCatalog;

/**
 * Handle integration provider requests through the REST API
 */
class IntegrationCatalogController {
	/**
	 * List integrations.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function index( \WP_REST_Request $request ) {
		return rest_ensure_response( IntegrationCatalog::get() );
	}

	/**
	 * Find the integration.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function find( \WP_REST_Request $request ) {
		return rest_ensure_response( IntegrationCatalog::find( $request->get_param( 'id' ) ) );
	}
}

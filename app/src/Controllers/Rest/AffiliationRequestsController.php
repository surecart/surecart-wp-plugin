<?php

namespace SureCart\Controllers\Rest;

use SureCart\Models\AffiliationRequest;

/**
 * Handle Affiliation requests through the REST API
 */
class AffiliationRequestsController extends RestController {
	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = AffiliationRequest::class;

	/**
	 * Approve an affiliation request.
	 *
	 * @param \WP_REST_Request $request
	 * @return \SureCart\Models\AffiliationRequest|\WP_Error
	 */
	public function approve( \WP_REST_Request $request ) {
		$affiliation_request = AffiliationRequest::find( $request['id'] );
		if ( is_wp_error( $affiliation_request ) ) {
			return $affiliation_request;
		}

		return $affiliation_request->approve( $request['id'] );
	}
}

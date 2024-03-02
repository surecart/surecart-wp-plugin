<?php

namespace SureCart\Controllers\Rest;

use SureCart\Models\Affiliation;

/**
 * Handle Affiliations through the REST API
 */
class AffiliationsController extends RestController {
	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = Affiliation::class;

	/**
	 * Activate the affiliate user.
	 *
	 * @param \WP_REST_Request $request
	 * @return \SureCart\Models\Affiliation|\WP_Error
	 */
	public function activate( \WP_REST_Request $request ) {
		$affiliation = Affiliation::find( $request['id'] );
		if ( is_wp_error( $affiliation ) ) {
			return $affiliation;
		}

		return $affiliation->activate( $request['id'] );
	}

	/**
	 * Deactivate the affiliate user.
	 *
	 * @param \WP_REST_Request $request
	 * @return \SureCart\Models\Affiliation|\WP_Error
	 */
	public function deactivate( \WP_REST_Request $request ) {
		$affiliation = Affiliation::find( $request['id'] );
		if ( is_wp_error( $affiliation ) ) {
			return $affiliation;
		}

		return $affiliation->deactivate( $request['id'] );
	}
}

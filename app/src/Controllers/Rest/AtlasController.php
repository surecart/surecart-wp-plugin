<?php

namespace SureCart\Controllers\Rest;

use SureCart\Models\Atlas;

/**
 * Handle Atlas through the REST API
 */
class AtlasController extends RestController {
	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = Atlas::class;

	/**
	 * Get a specific country details.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return array|\WP_Error
	 */
	public function getCountryDetails( \WP_REST_Request $request ) {
		$class = new $this->class( $request->get_json_params() );
		$model = $this->middleware( $class, $request, 'getCountryDetails' );
		if ( is_wp_error( $model ) ) {
			return $model;
		}
		return $model->getCountryDetails( $request['iso_code'] );
	}
}

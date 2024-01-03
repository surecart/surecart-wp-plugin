<?php

namespace SureCart\Controllers\Rest;

use SureCart\Models\Upsell;

/**
 * Handle upsell requests through the REST API
 */
class UpsellsController extends RestController {
	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = Upsell::class;

	/**
	 * Add a line item to an upsell.
	 *
	 * @param \WP_REST_Request $request Request object.
	 *
	 * @return \WP_REST_Response
	 */
	public function addLineItem( $request ) {
		$model = $this->middleware( new $this->class(), $request );
		if ( is_wp_error( $model ) ) {
			return $model;
		}

		return $model->where( $request->get_query_params() )->addLineItem( $request );
	}
}

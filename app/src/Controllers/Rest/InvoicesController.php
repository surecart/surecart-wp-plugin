<?php

namespace SureCart\Controllers\Rest;

use SureCart\Models\Invoice;

/**
 * Handle Invoice requests through the REST API
 */
class InvoicesController extends RestController {
	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = Invoice::class;

	/**
	 * Make draft invoice.
	 *
	 * @param \WP_REST_Request $request Request object.
	 *
	 * @return Invoice|\WP_Error
	 */
	public function makeDraft( \WP_REST_Request $request ) {
		$class     = new $this->class( $request->get_json_params() );
		$class->id = $request['id'];
		$model     = $this->middleware( $class, $request );

		if ( is_wp_error( $model ) ) {
			return $model;
		}

		return $model->where( $request->get_query_params() )->makeDraft( $request['id'] );
	}

	/**
	 * Open an invoice.
	 *
	 * @param \WP_REST_Request $request Request object.
	 *
	 * @return Invoice|\WP_Error
	 */
	public function open( \WP_REST_Request $request ) {
		$class     = new $this->class( $request->get_json_params() );
		$class->id = $request['id'];
		$model     = $this->middleware( $class, $request );

		if ( is_wp_error( $model ) ) {
			return $model;
		}

		return $model->where( $request->get_query_params() )->open( $request['id'] );
	}
}

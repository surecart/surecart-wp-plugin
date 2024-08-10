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
	 * @return \SureCart\Models\Invoice|\WP_Error
	 */
	public function makeDraft( \WP_REST_Request $request ) {
		return Invoice::makeDraft( $request['id'] );
	}

	/**
	 * Open an invoice.
	 *
	 * @param \WP_REST_Request $request Request object.
	 *
	 * @return \SureCart\Models\Invoice|\WP_Error
	 */
	public function open( \WP_REST_Request $request ) {
		return Invoice::open( $request['id'] );
	}
}

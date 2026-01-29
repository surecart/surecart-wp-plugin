<?php

namespace SureCart\Controllers\Rest;

use SureCart\Models\RuleSchema;

/**
 * Handle Rule Strings requests through the REST API
 */
class RuleSchemaController extends RestController {
	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = RuleSchema::class;

	/**
	 * Find Schema.
	 *
	 * @param \WP_REST_Request $request  Request object.
	 *
	 * @return \SureCart\Models\RuleSchema|\WP_Error
	 */
	public function find( \WP_REST_Request $request ) {
		return RuleSchema::find( $request['id'] );
	}
}

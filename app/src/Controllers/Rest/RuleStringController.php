<?php

namespace SureCart\Controllers\Rest;

use SureCart\Models\RuleString;

/**
 * Handle Rule Strings requests through the REST API
 */
class RuleStringController extends RestController {
	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = RuleString::class;

	/**
	 * Construct a Rule String from JSON.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response
	 */
	public function construct( \WP_REST_Request $request ) {
		$class = new $this->class( $request->get_json_params() );
		$model = $this->middleware( $class, $request, 'construct' );
		if ( is_wp_error( $model ) ) {
			return $model;
		}
		return $model->construct( $request['schema_id'], $request['groups'] );
	}

	/**
	 * Deconstruct a Rule String from JSON.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response
	 */
	public function deconstruct( \WP_REST_Request $request ) {
		$class = new $this->class( $request->get_json_params() );
		$model = $this->middleware( $class, $request, 'deconstruct' );
		if ( is_wp_error( $model ) ) {
			return $model;
		}
		return $model->deconstruct( $request['schema_id'], $request['rule_string'] );
	}
}

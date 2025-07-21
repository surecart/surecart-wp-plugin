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
	 * Run some middleware to run before request.
	 *
	 * @param \SureCart\Models\Model $class Model class instance.
	 * @param \WP_REST_Request       $request Request object.
	 * @param string                 $action Action Type.
	 *
	 * @return \SureCart\Models\Model
	 */
	protected function middleware( $class, \WP_REST_Request $request, $action = '' ) {
		if ( empty( $action ) ) {
			return new \WP_Error( 'invalid_request', __( 'No action specified.', 'surecart' ) );
		}

		if ( 'getSchema' === $action && empty( $request->get_param( 'schema_id' ) ) ) {
			return new \WP_Error( 'invalid_request', __( 'Please pass the schema_id.', 'surecart' ) );
		}

		if ( 'construct' === $action && empty( $request->get_param( 'rule_json' ) ) ) {
			return new \WP_Error( 'invalid_request', __( 'Please pass the rule_json.', 'surecart' ) );
		}

		if ( 'deconstruct' === $action && empty( $request->get_param( 'rule_string' ) ) ) {
			return new \WP_Error( 'invalid_request', __( 'Please pass the rule_string.', 'surecart' ) );
		}

		return parent::middleware( $class, $request );
	}

	/**
	 * Gets Rule String Schema.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response
	 */
	public function getSchema( \WP_REST_Request $request ) {
		$class = new $this->class( $request->get_json_params() );
		$model = $this->middleware( $class, $request, 'getSchema' );
		if ( is_wp_error( $model ) ) {
			return $model;
		}
		return $model->getSchema( $request['schema_id'] );
	}

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
		return $model->construct( $request['rule_json'] );
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
		return $model->deconstruct( $request['rule_string'] );
	}
}

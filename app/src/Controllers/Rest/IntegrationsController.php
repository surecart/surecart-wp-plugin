<?php

namespace SureCart\Controllers\Rest;

use SureCart\Models\Integration;

/**
 * Handle Price requests through the REST API
 */
class IntegrationsController extends RestController {
	/**
	 * Create a product integration.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function create( \WP_REST_Request $request ) {
		return Integration::create( $request->get_params() );
	}

	/**
	 * List all product integrations.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function index( \WP_REST_Request $request ) {
		$integration = new Integration();

		// integration model ids.
		if ( $request->get_param( 'integration_ids' ) ) {
			$integration = $integration->whereIn( 'integration_id', $request->get_param( 'integration_ids' ) );
		}

		// model ids.
		if ( $request->get_param( 'model_ids' ) ) {
			$integration = $integration->whereIn( 'model_id', $request->get_param( 'model_ids' ) );
		}

		$total    = $integration->count();
		$page     = $request->get_param( 'page' ) ? $request->get_param( 'page' ) : 1;
		$per_page = $request->get_param( 'per_page' ) ? $request->get_param( 'per_page' ) : 10;

		// handle pagination.
		$items = $integration->paginate(
			[
				'page'     => $page,
				'per_page' => $per_page,
			]
		);

		$response = rest_ensure_response( $items );
		$response->header( 'X-WP-Total', (int) $total );
		$response->header( 'X-WP-TotalPages', (int) ceil( $total / (int) $per_page ) );

		return $response;
	}

	/**
	 * Find a specific product integration.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function find( \WP_REST_Request $request ) {
		$model = $this->middleware( new $this->class(), $request );
		if ( is_wp_error( $model ) ) {
			return $model;
		}

		return $model->where( $request->get_query_params() )->find( $request['id'] );
	}

	/**
	 * Edit model.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function edit( \WP_REST_Request $request ) {
		$model = $this->middleware( new $this->class(), $request );
		if ( is_wp_error( $model ) ) {
			return $model;
		}

		return $model->where( $request->get_query_params() )->update( array_diff_assoc( $request->get_params(), $request->get_query_params() ) );
	}

	/**
	 * Delete model.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function delete( \WP_REST_Request $request ) {
		$model = $this->middleware( new $this->class(), $request );
		if ( is_wp_error( $model ) ) {
			return $model;
		}

		return $model->delete( $request['id'] );
	}
}

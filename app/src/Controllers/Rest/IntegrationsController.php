<?php

namespace SureCart\Controllers\Rest;

use SureCart\Concerns\SanitizesRestParams;
use SureCart\Models\Integration;

/**
 * Handle Price requests through the REST API
 */
class IntegrationsController extends RestController {
	use SanitizesRestParams;

	/**
	 * The model class.
	 *
	 * @var string
	 */
	protected $class = Integration::class;

	/**
	 * Create a product integration.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function create( \WP_REST_Request $request ) {
		do_action( 'surecart/integrations/create', $request->get_params() );
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
		$integration_ids = $request->get_param( 'integration_ids' );
		if ( ! empty( $integration_ids ) ) {
			$integration = $integration->whereIn( 'integration_id', array_map( 'sanitize_text_field', (array) $integration_ids ) );
		}

		// model ids.
		$model_ids = $request->get_param( 'model_ids' );
		if ( ! empty( $model_ids ) ) {
			$integration = $integration->whereIn( 'model_id', array_map( 'sanitize_text_field', (array) $model_ids ) );
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

		return $model->where(
			array_filter(
				[
					'model_id'       => $this->sanitizeFilterParam( $request->get_param( 'model_id' ) ),
					'integration_id' => $this->sanitizeFilterParam( $request->get_param( 'integration_id' ) ),
					'model_name'     => $this->sanitizeFilterParam( $request->get_param( 'model_name' ) ),
					'provider'       => $this->sanitizeFilterParam( $request->get_param( 'provider' ) ),
				],
				function ( $value ) {
					return null !== $value;
				}
			)
		)->find( $this->sanitizeFilterParam( $request['id'] ) );
	}

	/**
	 * Edit model.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function edit( \WP_REST_Request $request ) {
		$model = $this->middleware( new $this->class( $this->sanitizeFilterParam( $request['id'] ) ), $request );
		if ( is_wp_error( $model ) ) {
			return $model;
		}
		return $model->where(
			array_filter(
				[
					'model_id'       => $this->sanitizeFilterParam( $request->get_param( 'model_id' ) ),
					'integration_id' => $this->sanitizeFilterParam( $request->get_param( 'integration_id' ) ),
					'model_name'     => $this->sanitizeFilterParam( $request->get_param( 'model_name' ) ),
					'provider'       => $this->sanitizeFilterParam( $request->get_param( 'provider' ) ),
				],
				function ( $value ) {
					return null !== $value;
				}
			)
		)->update( $request->get_json_params() );
	}

	/**
	 * Delete model.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function delete( \WP_REST_Request $request ) {
		do_action( 'surecart/integrations/delete', $request->get_params() );
		return ( new $this->class() )->delete( $request['id'] );
	}
}

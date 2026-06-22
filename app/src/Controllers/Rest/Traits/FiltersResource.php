<?php

namespace SureCart\Controllers\Rest\Traits;

/**
 * Proxies the resource's rule-based filter endpoints through the REST API.
 */
trait FiltersResource {
	/**
	 * Return the rule schema for the resource.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return object|\WP_Error
	 */
	public function filter_schema( \WP_REST_Request $request ) {
		$model = $this->middleware( new $this->class(), $request );
		if ( is_wp_error( $model ) ) {
			return $model;
		}
		return $model->filterSchema();
	}

	/**
	 * Return a paginated, filtered collection for the resource.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function filter( \WP_REST_Request $request ) {
		$model = $this->middleware( new $this->class(), $request );
		if ( is_wp_error( $model ) ) {
			return $model;
		}

		// expand/$this->with is intentionally not forwarded here — filter operates on the rule tree, not query expansion.
		$params = $request->get_json_params() ?: [];
		$items  = $model->filter(
			$params['filter'] ?? [],
			[
				'page'     => $request->get_param( 'page' ),
				'per_page' => $request->get_param( 'per_page' ),
			]
		);

		if ( is_wp_error( $items ) ) {
			return $items;
		}

		$response = rest_ensure_response( $items->data );
		$response->header( 'X-WP-Total', (int) ( $items->pagination->count ?? 0 ) );
		$max_pages = ceil( ( $items->pagination->count ?? 0 ) / ( $items->pagination->limit ?? 1 ) );
		$response->header( 'X-WP-TotalPages', (int) $max_pages );

		return $response;
	}
}

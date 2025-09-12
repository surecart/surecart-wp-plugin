<?php

namespace SureCart\Controllers\Rest;

use SureCart\Models\Review;

/**
 * Handle Review requests through the REST API
 */
class ReviewsController extends RestController {
	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = Review::class;

	/**
	 * Publish a review.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return \WP_REST_Response|\WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function publish( \WP_REST_Request $request ) {
		$class     = new $this->class( $request->get_json_params() );
		$class->id = $request['id'];
		$model     = $this->middleware( $class, $request );
		if ( is_wp_error( $model ) ) {
			return $model;
		}
		
		return $model->where( $request->get_query_params() )->publish( $request['id'] );
	}

	/**
	 * Unpublish a review.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return \WP_REST_Response|\WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function unpublish( \WP_REST_Request $request ) {
		$class     = new $this->class( $request->get_json_params() );
		$class->id = $request['id'];
		$model     = $this->middleware( $class, $request );
		if ( is_wp_error( $model ) ) {
			return $model;
		}
		
		return $model->where( $request->get_query_params() )->unpublish( $request['id'] );
	}
}

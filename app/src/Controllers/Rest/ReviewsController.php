<?php

namespace SureCart\Controllers\Rest;

use SureCart\Models\Review;
use SureCart\Models\User;

/**
 * Handle Review requests through the REST API.
 */
class ReviewsController extends RestController {
	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = Review::class;

	/**
	 * Always fetch with these subcollections.
	 *
	 * @var array<string>
	 */
	protected $with = [ 'product', 'product.price', 'product.featured_product_media' ];

	/**
	 * Middleware before we make the request.
	 *
	 * @param \SureCart\Models\Model $class Model class instance.
	 * @param \WP_REST_Request       $request Request object.
	 *
	 * @return \SureCart\Models\Model|\WP_Error
	 */
	protected function middleware( $class, \WP_REST_Request $request ) {
		// Only set the user for create operations (user review submissions).
		// Skip for read operations (admin viewing) and other operations that don't require customer association runtime.
		if ( 'POST' === $request->get_method() ) {
			$class = $this->maybeSetUser( $class, $request );
		}

		// return the class.
		return apply_filters( 'surecart/request/model', $class, $request );
	}

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

		return $model->where( $request->get_query_params() )->with( $this->with )->publish( $request['id'] );
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

		return $model->where( $request->get_query_params() )->with( $this->with )->unpublish( $request['id'] );
	}

	/**
	 * Let's set the customer's email and name if they are already logged in.
	 *
	 * @param \SureCart\Models\Model $class Model class instance.
	 * @param \WP_REST_Request       $request Request object.
	 *
	 * @return \SureCart\Models\Model|\WP_Error
	 */
	protected function maybeSetUser( \SureCart\Models\Model $class, \WP_REST_Request $request ) {
		// Must be logged in.
		if ( ! is_user_logged_in() ) {
			return new \WP_Error(
				'surecart_rest_review_no_user',
				__( 'You must be logged in to submit a review.', 'surecart' ),
				[ 'status' => 401 ]
			);
		}

		$user = User::current();

		// Get or create live customer.
		$customer_id = $user->getOrCreateLiveCustomerId();
		if ( is_wp_error( $customer_id ) ) {
			return $customer_id;
		}

		// Set the customer ID on the review.
		$class['customer'] = sanitize_text_field( $customer_id );
		return $class;
	}
}

<?php

namespace SureCart\Controllers\Rest;

use SureCart;
use SureCart\Models\Customer;
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
		// set the user.
		$class = $this->maybeSetUser( $class, $request );

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
		$user = User::current();

		// Must be logged in.
		if ( ! $user ) {
			return new \WP_Error(
				'surecart_rest_review_no_user',
				__( 'You must be logged in to submit a review.', 'surecart' ),
				[ 'status' => 401 ]
			);
		}

		// Get or create live customer.
		$customer_id = $this->getLiveCustomerByUser( $user );

		if ( empty( $customer_id ) ) {
			return new \WP_Error(
				'surecart_rest_review_no_customer',
				__( 'Unable to identify customer for the current user.', 'surecart' ),
				[ 'status' => 400 ]
			);
		}

		// Set the customer ID on the review.
		$class['customer'] = $customer_id;
		return $class;
	}

	/**
	 * Get or create a live customer for the given user.
	 *
	 * @param User $user The user object.
	 *
	 * @return string|null The live customer ID or null if not found/created.
	 */
	protected function getLiveCustomerByUser( User $user ) {
		// Try to get the customer id from live mode first.
		$customer_id = $user->customerId( 'live' );

		if ( ! empty( $customer_id ) ) {
			return $customer_id;
		}

		// If not in live mode, check test mode customer.
		$customer_id = $user->customerId( 'test' );

		// If we have a test customer but no live customer, create a live customer.
		if ( ! empty( $customer_id ) ) {
			$customer = Customer::create(
				[
					'name'      => $user->display_name,
					'email'     => strtolower( $user->user_email ),
					'live_mode' => true,
				],
				false // don't create a user.
			);

			return $customer->id ?? null;
		}

		return null;
	}
}

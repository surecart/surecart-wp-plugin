<?php

namespace CheckoutEngine\Controllers\Rest;

use CheckoutEngine\Models\Subscription;

/**
 * Handle Price requests through the REST API
 */
class SubscriptionsController extends RestController {
	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = Subscription::class;

	/**
	 * Cancel a subscription.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response
	 */
	public function cancel( \WP_REST_Request $request ) {
		$model = $this->middleware( new $this->class(), $request );
		if ( is_wp_error( $model ) ) {
			return $model;
		}

		// do we immediately cancel or at period end?
		if ( apply_filters( 'checkout_engine/subscription/cancel/immediate', false, $request ) ) {
			return $model->where( $request->get_query_params() )->cancel( $request['id'] );
		}

		return $model->where( $request->get_query_params() )->update( [ 'cancel_at_period_end' => true ] );
	}
}

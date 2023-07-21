<?php

namespace SureCart\Controllers\Rest;

use SureCart\Models\Subscription;

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
		$model = $this->middleware( new $this->class( array_diff_assoc( $request->get_params(), $request->get_query_params() ) ), $request );
		if ( is_wp_error( $model ) ) {
			return $model;
		}
		return $model->where( $request->get_query_params() )->cancel( $request['id'] );
	}

	/**
	 * Complete a subscription.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response
	 */
	public function complete( \WP_REST_Request $request ) {
		$model = $this->middleware( new $this->class(), $request );
		if ( is_wp_error( $model ) ) {
			return $model;
		}
		return $model->where( $request->get_query_params() )->complete( $request['id'] );
	}

	/**
	 * Restore a subscription.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response
	 */
	public function restore( \WP_REST_Request $request ) {
		$model = $this->middleware( new $this->class(), $request );
		if ( is_wp_error( $model ) ) {
			return $model;
		}
		return $model->where( $request->get_query_params() )->restore( $request['id'] );
	}

	/**
	 * Restore a subscription.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response
	 */
	public function preserve( \WP_REST_Request $request ) {
		$model = $this->middleware( new $this->class(), $request );
		if ( is_wp_error( $model ) ) {
			return $model;
		}
		return $model->where( $request->get_query_params() )->preserve( $request['id'] );
	}


	/**
	 * Renew a subscription.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response
	 */
	public function renew( \WP_REST_Request $request ) {
		$model = $this->middleware( new $this->class(), $request );
		if ( is_wp_error( $model ) ) {
			return $model;
		}
		return $model->where( $request->get_query_params() )->renew( $request['id'] );
	}

	/**
	 * Preview an upcoming invoice.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response|\SureCart\Models\Model|WP_Error
	 */
	public function upcomingPeriod( \WP_REST_Request $request ) {
		$model = $this->middleware( new $this->class( $request['id'] ), $request );

		if ( is_wp_error( $model ) ) {
			return $model;
		}

		return $model->where( $request->get_query_params() )->upcomingPeriod(
			$this->recursive_array_diff_assoc( $request->get_params(), $request->get_query_params() )
		);
	}

	/**
	 * Pays off all remaining periods for a subscription.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response
	 */
	public function payOff( \WP_REST_Request $request ) {
		$model = $this->middleware( new $this->class(), $request );
		if ( is_wp_error( $model ) ) {
			return $model;
		}
		return $model->where( $request->get_query_params() )->payOff( $request['id'] );
	}

	/**
	 * Finds difference between nested arrays recursively
	 *
	 * @param array $array1 First array to compare.
	 * @param array $array2 Second array to compare.
	 *
	 * @return array Difference between arrays.
	 */
	public function recursive_array_diff_assoc( array $array1, array $array2 ): array {
		// If both arrays are empty, return an empty array.
		if ( empty( $array1 ) && empty( $array2 ) ) {
			return array();
		}

		$difference = array();

		foreach ( $array1 as $key => $value ) {
			$array2_value = array_key_exists( $key, $array2 ) ? $array2[ $key ] : null;

			if ( is_array( $value ) && is_array( $array2_value ) ) {
				$recursive_diff = $this->recursive_array_diff_assoc( $value, $array2_value );
				if ( ! empty( $recursive_diff ) ) {
					$difference[ $key ] = $recursive_diff;
				}
			} elseif ( $array2_value !== $value ) {
				$difference[ $key ] = $value;
			}
		}

		return $difference;
	}
}

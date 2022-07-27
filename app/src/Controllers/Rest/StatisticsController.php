<?php

namespace SureCart\Controllers\Rest;

use SureCart\Models\Order;

/**
 * Handle Statistic requests through the REST API
 */
class StatisticsController {
	/**
	 * Map a string to php class
	 *
	 * @var array
	 */
	protected $models = [
		'orders' => Order::class,
	];

	/**
	 * Find model.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function find( \WP_REST_Request $request ) {
		return $this->models[ $request['id'] ]::stats( $request->get_query_params() );
	}
}

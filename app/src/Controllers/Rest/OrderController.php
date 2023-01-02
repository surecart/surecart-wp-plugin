<?php

namespace SureCart\Controllers\Rest;

use SureCart\Models\Order;
use SureCart\Models\Form;
use SureCart\Models\User;
use SureCart\WordPress\Users\CustomerLinkService;

/**
 * Handle price requests through the REST API
 */
class OrderController extends RestController {
	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = Order::class;

	/**
	 * Cancel an order
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \SureCart\Models\Checkout|\WP_Error
	 */
	public function cancel( \WP_REST_Request $request ) {
		$order = $this->middleware( new $this->class( $request['id'] ), $request );
		if ( is_wp_error( $order ) ) {
			return $order;
		}
		return $order->where( $request->get_query_params() )->cancel();
	}
}

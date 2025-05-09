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
	 * Resend order notification.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response
	 */
	public function resend_notification( \WP_REST_Request $request ) {
		$model = $this->middleware( new $this->class(), $request );
		if ( is_wp_error( $model ) ) {
			return $model;
		}
		return $model->where( $request->get_query_params() )->resend_notification( $request['id'] );
	}
}

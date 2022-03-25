<?php

namespace SureCart\Controllers\Rest;

use SureCart\Models\Customer;
use SureCart\Models\User;

/**
 * Handle Price requests through the REST API
 */
class CustomerController extends RestController {
	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = Customer::class;

	/**
	 * Connect a user.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response
	 */
	public function connect( \WP_REST_Request $request ) {
		$customer = Customer::find( $request['customer_id'] );
		if ( is_wp_error( $customer ) ) {
			return $customer;
		}

		$user = User::find( $request['user_id'] );
		if ( is_wp_error( $user ) ) {
			return $user;
		}

		$user->setCustomerId( $customer->id, $customer->live_mode ? 'live' : 'test' );
		$controller = new \WP_REST_Users_Controller();

		return rest_ensure_response( $controller->prepare_item_for_response( $user->getUser(), $request ) );

	}
}

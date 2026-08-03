<?php

namespace SureCart\Controllers\Rest;

use SureCart\Models\Customer;
use SureCart\Models\User;

/**
 * Handle Customer related REST API requests.
 */
class CustomerController extends RestController {
	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = Customer::class;

	/**
	 * Get the current logged-in user's customer record.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \SureCart\Models\Customer|null|\WP_Error
	 */
	public function me( \WP_REST_Request $request ) {
		$mode = $request->get_param( 'mode' ) ?? 'live';
		$user = User::current();

		$customer_id = $user->customerId( $mode );
		if ( empty( $customer_id ) ) {
			return null;
		}

		// Set the ID in the request to fetch the customer record.
		$request->set_param( 'id', $customer_id );

		return $this->find( $request );
	}

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

		$response = $user->setCustomerId( $customer->id, $customer->live_mode ? 'live' : 'test', $request['force'] ?? false );
		if ( is_wp_error( $response ) ) {
			return $response;
		}

		$controller = new \WP_REST_Users_Controller();
		return rest_ensure_response( $controller->prepare_item_for_response( $user->getUser(), $request ) );
	}

	/**
	 * Sync Users with platform.
	 * This catches the request and enqueues the action to start the sync.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function sync( \WP_REST_Request $request ) {
		// enqueue action.
		return as_enqueue_async_action(
			'surecart/sync/customers',
			[
				'page'        => 1,
				'batch_size'  => apply_filters( 'surecart/sync/customers/batch_size', 100 ),
				'create_user' => $request->get_param( 'create_user' ),
				'run_actions' => $request->get_param( 'run_actions' ),
			],
			'surecart'
		);
	}

	/**
	 * Expose media for a customer.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \SureCart\Models\Media|false
	 */
	public function exposeMedia( \WP_REST_Request $request ) {
		$customer = $this->middleware( new $this->class( $request['id'] ), $request );
		if ( is_wp_error( $customer ) ) {
			return $customer;
		}

		return $customer->where( $request->get_query_params() )->exposeMedia( $request['media_id'] );
	}

	/**
	 * Edit model.
	 *
	 * Platform first — the linked WordPress user is only synced from the
	 * response the platform actually accepted, never from raw request input.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \SureCart\Models\Customer|\WP_Error
	 */
	public function edit( \WP_REST_Request $request ) {
		$customer = parent::edit( $request );

		if ( is_wp_error( $customer ) || empty( $customer ) ) {
			return $customer;
		}

		$this->syncWPUser( $customer );

		return $customer;
	}

	/**
	 * Sync the linked WordPress user's profile from an updated customer.
	 *
	 * Best-effort — the platform write has already succeeded, so a failed
	 * local update must not fail the request. Delegates the actual field
	 * sync (and its "never sync email" rule) to UsersService so the webhook
	 * and REST paths can't drift apart.
	 *
	 * @param \SureCart\Models\Customer $customer The updated customer returned by the platform.
	 *
	 * @return void
	 */
	protected function syncWPUser( $customer ) {
		$wp_user = User::findByCustomerId( $customer->id );
		if ( ! $wp_user || empty( $wp_user->ID ) ) {
			return;
		}

		// dispatch through the edit_sc_customer meta cap so this stays in sync with the
		// user_has_cap filtering the rest of the codebase relies on for ownership checks.
		if ( ! current_user_can( 'edit_sc_customer', $customer->id, [] ) ) {
			return;
		}

		$users_service = \SureCart::resolve( 'surecart.users' );
		if ( $users_service ) {
			$users_service->applyCustomerToWPUser( $wp_user, $customer );
		}
	}
}

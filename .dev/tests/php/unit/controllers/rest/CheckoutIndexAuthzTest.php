<?php

namespace SureCart\Tests\Controllers\Rest;

use SureCart\Permissions\Models\CheckoutPermissionsController;
use SureCart\Tests\MocksRequestService;
use SureCart\Tests\SureCartUnitTestCase;
use WP_REST_Request;

/**
 * SUR-5621 — the checkouts index authorizes via isListingOwnCustomerIds().
 * An associative customer_ids body previously passed the loose guard and was
 * forwarded as an encoding the platform ignores, listing every checkout in
 * the store (customer ids + emails) to any logged-in user.
 *
 * @group rest-authz-hardening
 */
class CheckoutIndexAuthzTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;
	use MocksRequestService;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp(): void {
		\SureCart::make()->bootstrap(
			[
				'providers'              => [
					\SureCart\Request\RequestServiceProvider::class,
					\SureCart\Support\Errors\ErrorsServiceProvider::class,
					\SureCart\WordPress\PluginServiceProvider::class,
					\SureCart\Permissions\PermissionsServiceProvider::class,
					\SureCart\Rest\CheckoutRestServiceProvider::class,
				],
				// wires the user_has_cap handler the index permission check runs through.
				'permission_controllers' => [
					CheckoutPermissionsController::class,
				],
			],
			false
		);

		parent::setUp();
	}

	/**
	 * Log in a fresh subscriber holding a live customer id.
	 *
	 * @return int User ID.
	 */
	protected function actAsSubscriberWithCustomerId() {
		$user_id = self::factory()->user->create( array( 'role' => 'subscriber' ) );
		update_user_meta( $user_id, 'sc_customer_ids', array( 'live' => 'cus_mine_123' ) );
		wp_set_current_user( $user_id );
		return $user_id;
	}

	/**
	 * Dispatch a checkouts index request with a JSON body, as the researcher did.
	 *
	 * @param array $body JSON body params.
	 * @return \WP_REST_Response
	 */
	protected function dispatchIndex( $body ) {
		$request = new WP_REST_Request( 'GET', '/surecart/v1/checkouts' );
		$request->set_header( 'Content-Type', 'application/json' );
		$request->set_body( wp_json_encode( $body ) );
		return rest_do_request( $request );
	}

	/**
	 * The live vector: `{"customer_ids":{"x":true}}` is refused before the
	 * platform is ever contacted.
	 */
	public function test_subscriber_with_associative_customer_ids_is_refused() {
		$this->actAsSubscriberWithCustomerId();
		$this->mockRequestNeverCalled();

		$response = $this->dispatchIndex( array( 'customer_ids' => array( 'x' => true ) ) );

		$this->assertSame( 403, $response->get_status() );
		$this->assertSame( 'rest_forbidden', $response->get_data()['code'] );
	}

	/**
	 * A scalar customer_ids also bypassed the pre-fix guard — foreach over a
	 * scalar warns and skips the loop, falling through to `return true` — and
	 * reaches the guard because permission_callback runs before schema
	 * validation. It must refuse before the platform is contacted.
	 */
	public function test_subscriber_with_scalar_customer_ids_is_refused() {
		$this->actAsSubscriberWithCustomerId();
		$this->mockRequestNeverCalled();

		$response = $this->dispatchIndex( array( 'customer_ids' => 'anything' ) );

		$this->assertSame( 403, $response->get_status() );
		$this->assertSame( 'rest_forbidden', $response->get_data()['code'] );
	}

	/**
	 * The control proving the refusal is not vacuous: the same subscriber
	 * listing their own id as a sequential list is authorized and the
	 * platform is queried.
	 */
	public function test_subscriber_listing_own_customer_ids_is_authorized() {
		$this->actAsSubscriberWithCustomerId();

		$captured = array();
		$this->mockRequest(
			(object) array(
				'data'       => array(),
				'pagination' => (object) array(
					'count' => 0,
					'limit' => 20,
				),
			),
			$captured
		);

		$response = $this->dispatchIndex( array( 'customer_ids' => array( 'cus_mine_123' ) ) );

		$this->assertSame( 200, $response->get_status() );
		$this->assertSame( 'checkouts', $captured[0] );
	}
}

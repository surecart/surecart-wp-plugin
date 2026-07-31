<?php

namespace SureCart\Tests\Controllers\Rest;

use SureCart\Permissions\Models\CheckoutPermissionsController;
use SureCart\Request\RequestService;
use SureCart\Tests\MocksRequestService;
use SureCart\Tests\SureCartUnitTestCase;
use WP_REST_Request;

/**
 * SUR-5621 — checkouts index items are filtered by schema context.
 * The checkout schema declares `customer` and `customer_id` edit-only, but
 * the per-item index filter is opt-in and the provider never opted in, so
 * view-context lists emitted them (and `metadata.wp_created_by`) anyway.
 * `$filters_list_items = true` routes each item through the provider's
 * `filter_response_by_context()` override, and requesting edit context on
 * the index — which skips that filtering — requires `edit_sc_checkouts`.
 *
 * @group rest-authz-hardening
 */
class CheckoutIndexContextFilterTest extends SureCartUnitTestCase {
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

		// account currency + locale reads during checkout amount serialization.
		\SureCart::alias(
			'account',
			function () {
				return (object) [
					'currency' => 'usd',
				];
			}
		);
		\SureCart::alias(
			'settings',
			function () {
				return new class() {
					public function get( $key, $default = null ) {
						return $default;
					}
				};
			}
		);

		parent::setUp();
	}

	/**
	 * Log in a fresh subscriber holding the given customer id meta.
	 *
	 * @param array $customer_ids Customer ids keyed by mode.
	 * @return int User ID.
	 */
	protected function actAsSubscriberWithCustomerIds( $customer_ids ) {
		$user_id = self::factory()->user->create( array( 'role' => 'subscriber' ) );
		update_user_meta( $user_id, 'sc_customer_ids', $customer_ids );
		wp_set_current_user( $user_id );
		return $user_id;
	}

	/**
	 * Log in a fresh user holding the given capabilities.
	 *
	 * @param array $caps Capabilities to grant.
	 * @return void
	 */
	protected function actAsUserWithCaps( $caps ) {
		$user = self::factory()->user->create_and_get();
		foreach ( $caps as $cap ) {
			$user->add_cap( $cap );
		}
		wp_set_current_user( $user->ID );
	}

	/**
	 * Dispatch a checkouts index request.
	 *
	 * @param array $body  JSON body params.
	 * @param array $query Query params.
	 * @return \WP_REST_Response
	 */
	protected function dispatchIndex( $body = array(), $query = array() ) {
		$request = new WP_REST_Request( 'GET', '/surecart/v1/checkouts' );
		if ( ! empty( $query ) ) {
			$request->set_query_params( $query );
		}
		if ( ! empty( $body ) ) {
			$request->set_header( 'Content-Type', 'application/json' );
			$request->set_body( wp_json_encode( $body ) );
		}
		return rest_do_request( $request );
	}

	/**
	 * Mock the platform request and capture the args of the checkouts call.
	 *
	 * View-context serialization can fetch display currencies while
	 * formatting amounts — those calls are tolerated, not captured.
	 *
	 * @param mixed $return   Value to return for the checkouts request.
	 * @param array $captured Reference filled with the checkouts request args.
	 * @return void
	 */
	protected function mockCheckoutIndexRequest( $return, &$captured ) {
		$requests = \Mockery::mock( RequestService::class );
		\SureCart::alias(
			'request',
			function () use ( $requests ) {
				return call_user_func_array( [ $requests, 'makeRequest' ], func_get_args() );
			}
		);

		$requests->shouldReceive( 'makeRequest' )
			->withSomeOfArgs( 'display_currencies' )
			->zeroOrMoreTimes()
			->andReturn( (object) [ 'data' => [] ] );

		$requests->shouldReceive( 'makeRequest' )
			->once()
			->andReturnUsing(
				function ( ...$args ) use ( $return, &$captured ) {
					$captured = $args;
					return $return;
				}
			);
	}

	/**
	 * A one-checkout platform list carrying every field under test.
	 *
	 * @param string $customer_id Customer id of the checkout's owner.
	 * @return object
	 */
	protected function checkoutListFixture( $customer_id ) {
		return (object) [
			'data'       => [
				(object) [
					'id'       => 'checkout_123',
					'status'   => 'paid',
					'currency' => 'usd',
					'customer' => (object) [
						'id'    => $customer_id,
						'email' => 'private@example.com',
					],
					'metadata' => (object) [
						'wp_created_by' => 5,
						'buy_page'      => 'yes',
					],
				],
			],
			'pagination' => (object) [
				'count' => 1,
				'limit' => 20,
			],
		];
	}

	/**
	 * A customer listing their own live-mode checkouts keeps their own
	 * customer fields — the filter grants edit context on an owner match.
	 */
	public function test_customer_listing_own_live_checkouts_keeps_customer_fields() {
		$this->actAsSubscriberWithCustomerIds( array( 'live' => 'cus_mine_123' ) );
		$this->mockCheckoutIndexRequest( $this->checkoutListFixture( 'cus_mine_123' ), $captured );

		$response = $this->dispatchIndex( array( 'customer_ids' => array( 'cus_mine_123' ) ) );
		$items    = $response->get_data();

		$this->assertSame( 200, $response->get_status() );
		$this->assertSame( 'checkouts', $captured[0] );
		$this->assertCount( 1, $items );
		$this->assertSame( 'cus_mine_123', $items[0]['customer']['id'] );
		$this->assertSame( 'cus_mine_123', $items[0]['customer_id'] );
	}

	/**
	 * A customer's test-mode checkout list loses the customer fields: the
	 * filter compares against the live customer id only, while listing
	 * authorizes against all modes. Known, accepted — nothing reads these
	 * fields off an index response today, and making the comparison
	 * mode-aware also changes the single-item path. Tracked in SUR-5624.
	 */
	public function test_customer_test_mode_checkout_list_loses_customer_fields() {
		$this->actAsSubscriberWithCustomerIds( array( 'test' => 'cus_test_456' ) );
		$this->mockCheckoutIndexRequest( $this->checkoutListFixture( 'cus_test_456' ), $captured );

		$response = $this->dispatchIndex( array( 'customer_ids' => array( 'cus_test_456' ) ) );
		$items    = $response->get_data();

		$this->assertSame( 200, $response->get_status() );
		$this->assertCount( 1, $items );
		$this->assertArrayNotHasKey( 'customer', $items[0] );
		$this->assertArrayNotHasKey( 'customer_id', $items[0] );
	}

	/**
	 * A user holding edit_sc_customers keeps the customer fields on other
	 * customers' checkouts — the filter's early capability return.
	 */
	public function test_user_with_edit_sc_customers_keeps_customer_fields() {
		$this->actAsUserWithCaps( array( 'read_sc_checkouts', 'edit_sc_customers' ) );
		$this->mockCheckoutIndexRequest( $this->checkoutListFixture( 'cus_someone_else' ), $captured );

		$response = $this->dispatchIndex();
		$items    = $response->get_data();

		$this->assertSame( 200, $response->get_status() );
		$this->assertCount( 1, $items );
		$this->assertSame( 'cus_someone_else', $items[0]['customer']['id'] );
		$this->assertSame( 'cus_someone_else', $items[0]['customer_id'] );
	}

	/**
	 * Requesting edit context on the index without edit_sc_checkouts is
	 * refused before the platform is contacted — otherwise four characters
	 * in the query string would bypass the per-item filtering.
	 */
	public function test_subscriber_edit_context_index_is_refused() {
		$this->actAsSubscriberWithCustomerIds( array( 'live' => 'cus_mine_123' ) );
		$this->mockRequestNeverCalled();

		$response = $this->dispatchIndex(
			array( 'customer_ids' => array( 'cus_mine_123' ) ),
			array( 'context' => 'edit' )
		);

		$this->assertSame( 403, $response->get_status() );
		$this->assertSame( 'rest_forbidden_context', $response->get_data()['code'] );
	}

	/**
	 * An edit_sc_checkouts holder can still request edit context on the
	 * index and keeps the customer fields — the admin UI is unaffected.
	 */
	public function test_edit_sc_checkouts_holder_can_request_edit_context_index() {
		$this->actAsUserWithCaps( array( 'read_sc_checkouts', 'edit_sc_checkouts' ) );
		$this->mockCheckoutIndexRequest( $this->checkoutListFixture( 'cus_someone_else' ), $captured );

		$response = $this->dispatchIndex( array(), array( 'context' => 'edit' ) );
		$items    = $response->get_data();

		$this->assertSame( 200, $response->get_status() );
		$this->assertSame( 'checkouts', $captured[0] );
		$this->assertCount( 1, $items );
		$this->assertSame( 'cus_someone_else', $items[0]->customer->id );
	}

	/**
	 * A cap holder's edit-context list skips per-item filtering entirely —
	 * items stay unserialized models with the metadata intact.
	 */
	public function test_cap_holder_edit_context_list_gets_unfiltered_items() {
		$this->actAsUserWithCaps( array( 'read_sc_checkouts', 'edit_sc_checkouts' ) );
		$this->mockCheckoutIndexRequest( $this->checkoutListFixture( 'cus_someone_else' ), $captured );

		$response = $this->dispatchIndex( array(), array( 'context' => 'edit' ) );
		$items    = $response->get_data();

		$this->assertSame( 200, $response->get_status() );
		$this->assertCount( 1, $items );
		$this->assertInstanceOf( \SureCart\Models\Checkout::class, $items[0] );
		$this->assertSame( 5, $items[0]->metadata->wp_created_by );
	}

	/**
	 * The flag flip also enables the index-side wp_created_by strip — a WP
	 * user id disclosure separate from the schema-context filtering.
	 */
	public function test_wp_created_by_is_stripped_from_index_items() {
		$this->actAsSubscriberWithCustomerIds( array( 'live' => 'cus_mine_123' ) );
		$this->mockCheckoutIndexRequest( $this->checkoutListFixture( 'cus_mine_123' ), $captured );

		$response = $this->dispatchIndex( array( 'customer_ids' => array( 'cus_mine_123' ) ) );
		$items    = $response->get_data();

		$this->assertSame( 200, $response->get_status() );
		// the metadata accessor returns the raw object — normalize for the key check.
		$metadata = (array) $items[0]['metadata'];
		$this->assertArrayNotHasKey( 'wp_created_by', $metadata );
		$this->assertSame( 'yes', $metadata['buy_page'] );
	}
}

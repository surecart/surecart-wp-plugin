<?php

namespace SureCart\Tests\Controllers\Rest;

use SureCart\Controllers\Rest\CustomerAddressesController;
use SureCart\Models\User;
use SureCart\Rest\CustomerAddressesRestServiceProvider;
use SureCart\Tests\SureCartUnitTestCase;
use WP_REST_Request;

class CustomerAddressesControllerTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp(): void {
		\SureCart::make()->bootstrap(
			[
				'providers' => [
					\SureCart\Request\RequestServiceProvider::class,
					\SureCart\Support\Errors\ErrorsServiceProvider::class,
					\SureCart\WordPress\PluginServiceProvider::class,
				],
			],
			false
		);

		parent::setUp();
	}

	/**
	 * Test permission check denies unauthenticated users.
	 *
	 * @group customer-addresses
	 */
	public function test_permission_check_denies_unauthenticated_users() {
		wp_set_current_user( 0 );

		$provider = new CustomerAddressesRestServiceProvider();
		$request  = new WP_REST_Request( 'GET', '/surecart/v1/customer-addresses' );

		$result = $provider->get_addresses_permissions_check( $request );

		$this->assertWPError( $result );
		$this->assertSame( 'rest_not_logged_in', $result->get_error_code() );
		$this->assertSame( 401, $result->get_error_data()['status'] );
	}

	/**
	 * Test permission check allows logged-in users.
	 *
	 * @group customer-addresses
	 */
	public function test_permission_check_allows_logged_in_users() {
		$user_id = self::factory()->user->create();
		wp_set_current_user( $user_id );

		$provider = new CustomerAddressesRestServiceProvider();
		$request  = new WP_REST_Request( 'GET', '/surecart/v1/customer-addresses' );

		$result = $provider->get_addresses_permissions_check( $request );

		$this->assertTrue( $result );
	}

	/**
	 * Test returns empty data when user has no customer ID.
	 *
	 * @group customer-addresses
	 */
	public function test_returns_empty_data_when_no_customer_id() {
		$user_id = self::factory()->user->create();
		wp_set_current_user( $user_id );

		$controller = new CustomerAddressesController();
		$request    = new WP_REST_Request( 'GET', '/surecart/v1/customer-addresses' );
		$request->set_param( 'mode', 'live' );

		$result = $controller->getAddresses( $request );

		$this->assertIsArray( $result );
		$this->assertSame( [], $result['shipping_address'] );
		$this->assertSame( [], $result['billing_address'] );
		$this->assertSame( '', $result['first_name'] );
		$this->assertSame( '', $result['last_name'] );
		$this->assertSame( '', $result['phone'] );
	}

	/**
	 * Test returns customer address data when user has a customer profile.
	 *
	 * @group customer-addresses
	 */
	public function test_returns_customer_addresses_when_customer_exists() {
		$requests = \Mockery::mock( \SureCart\Request\RequestService::class );
		\SureCart::alias(
			'request',
			function () use ( $requests ) {
				return call_user_func_array( [ $requests, 'makeRequest' ], func_get_args() );
			}
		);

		$user_id = self::factory()->user->create();
		wp_set_current_user( $user_id );

		$user = User::find( $user_id );
		$user->setCustomerId( 'cust_test_123', 'test' );

		$shipping_address = (object) [
			'city'        => 'New York',
			'country'     => 'US',
			'line_1'      => '123 Main St',
			'line_2'      => '',
			'postal_code' => '10001',
			'state'       => 'NY',
		];

		$billing_address = (object) [
			'city'        => 'Los Angeles',
			'country'     => 'US',
			'line_1'      => '456 Oak Ave',
			'line_2'      => 'Suite 200',
			'postal_code' => '90001',
			'state'       => 'CA',
		];

		// Mock the customer API call.
		$requests->shouldReceive( 'makeRequest' )
			->once()
			->withSomeOfArgs( 'customers/cust_test_123' )
			->andReturn(
				(object) [
					'id'               => 'cust_test_123',
					'first_name'       => 'John',
					'last_name'        => 'Doe',
					'phone'            => '+1234567890',
					'shipping_address' => $shipping_address,
					'billing_address'  => $billing_address,
				]
			);

		$controller = new CustomerAddressesController();
		$request    = new WP_REST_Request( 'GET', '/surecart/v1/customer-addresses' );
		$request->set_param( 'mode', 'test' );

		$result = $controller->getAddresses( $request );

		$this->assertIsArray( $result );
		$this->assertSame( $shipping_address, $result['shipping_address'] );
		$this->assertSame( $billing_address, $result['billing_address'] );
		$this->assertSame( 'John', $result['first_name'] );
		$this->assertSame( 'Doe', $result['last_name'] );
		$this->assertSame( '+1234567890', $result['phone'] );
	}

	/**
	 * Test returns empty data when customer API call fails.
	 *
	 * @group customer-addresses
	 */
	public function test_returns_empty_data_when_customer_fetch_fails() {
		$requests = \Mockery::mock( \SureCart\Request\RequestService::class );
		\SureCart::alias(
			'request',
			function () use ( $requests ) {
				return call_user_func_array( [ $requests, 'makeRequest' ], func_get_args() );
			}
		);

		$user_id = self::factory()->user->create();
		wp_set_current_user( $user_id );

		$user = User::find( $user_id );
		$user->setCustomerId( 'cust_test_456', 'test' );

		// Mock the customer API call returning an error.
		$requests->shouldReceive( 'makeRequest' )
			->once()
			->withSomeOfArgs( 'customers/cust_test_456' )
			->andReturn(
				new \WP_Error( 'api_error', 'Customer not found' )
			);

		$controller = new CustomerAddressesController();
		$request    = new WP_REST_Request( 'GET', '/surecart/v1/customer-addresses' );
		$request->set_param( 'mode', 'test' );

		$result = $controller->getAddresses( $request );

		$this->assertIsArray( $result );
		$this->assertSame( [], $result['shipping_address'] );
		$this->assertSame( [], $result['billing_address'] );
		$this->assertSame( '', $result['first_name'] );
		$this->assertSame( '', $result['last_name'] );
		$this->assertSame( '', $result['phone'] );
	}

	/**
	 * Test defaults to live mode when mode param is not set.
	 *
	 * @group customer-addresses
	 */
	public function test_defaults_to_live_mode() {
		$user_id = self::factory()->user->create();
		wp_set_current_user( $user_id );

		$controller = new CustomerAddressesController();
		$request    = new WP_REST_Request( 'GET', '/surecart/v1/customer-addresses' );
		// Don't set mode param — should default to 'live'.

		$result = $controller->getAddresses( $request );

		// Should return empty data (no customer ID in live mode).
		$this->assertIsArray( $result );
		$this->assertSame( [], $result['shipping_address'] );
	}
}

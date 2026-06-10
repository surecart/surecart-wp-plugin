<?php

namespace SureCart\Tests\Controllers\Rest;

use SureCart\Controllers\Rest\CustomerController;
use SureCart\Models\User;
use SureCart\Request\RequestService;
use SureCart\Rest\CustomerRestServiceProvider;
use SureCart\Tests\SureCartUnitTestCase;
use WP_REST_Request;

class CustomerMeTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

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
	 * @group customer-me
	 */
	public function test_permission_check_denies_unauthenticated_users() {
		wp_set_current_user( 0 );

		$provider = new CustomerRestServiceProvider();
		$request  = new WP_REST_Request( 'GET', '/surecart/v1/customers/me' );

		$result = $provider->me_permissions_check( $request );

		$this->assertWPError( $result );
		$this->assertSame( 'rest_not_logged_in', $result->get_error_code() );
		$this->assertSame( 401, $result->get_error_data()['status'] );
	}

	/**
	 * @group customer-me
	 */
	public function test_permission_check_allows_logged_in_users() {
		$user_id = self::factory()->user->create();
		wp_set_current_user( $user_id );

		$provider = new CustomerRestServiceProvider();
		$request  = new WP_REST_Request( 'GET', '/surecart/v1/customers/me' );

		$this->assertTrue( $provider->me_permissions_check( $request ) );
	}

	/**
	 * @group customer-me
	 */
	public function test_me_returns_null_when_user_has_no_customer() {
		$user_id = self::factory()->user->create();
		wp_set_current_user( $user_id );

		$controller = new CustomerController();
		$request    = new WP_REST_Request( 'GET', '/surecart/v1/customers/me' );
		$request->set_param( 'mode', 'live' );

		$this->assertNull( $controller->me( $request ) );
	}

	/**
	 * @group customer-me
	 */
	public function test_me_returns_customer_via_find_when_linked() {
		$requests = \Mockery::mock( RequestService::class );
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
			'postal_code' => '10001',
			'state'       => 'NY',
		];

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
				]
			);

		$controller = new CustomerController();
		$request    = new WP_REST_Request( 'GET', '/surecart/v1/customers/me' );
		$request->set_param( 'mode', 'test' );

		$result = $controller->me( $request );

		$this->assertSame( 'cust_test_123', $result->id );
		$this->assertSame( 'John', $result->first_name );
		$this->assertSame( 'Doe', $result->last_name );
		$this->assertSame( '+1234567890', $result->phone );
		$this->assertSame( $shipping_address, $result->shipping_address );
	}

	/**
	 * @group customer-me
	 */
	public function test_me_defaults_to_live_mode() {
		$user_id = self::factory()->user->create();
		wp_set_current_user( $user_id );

		$user = User::find( $user_id );
		$user->setCustomerId( 'cust_test_only', 'test' );

		$controller = new CustomerController();
		$request    = new WP_REST_Request( 'GET', '/surecart/v1/customers/me' );

		$this->assertNull( $controller->me( $request ) );
	}

	/**
	 * @group customer-me
	 */
	public function test_me_returns_wp_error_when_api_fails() {
		$requests = \Mockery::mock( RequestService::class );
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

		$requests->shouldReceive( 'makeRequest' )
			->once()
			->withSomeOfArgs( 'customers/cust_test_456' )
			->andReturn( new \WP_Error( 'api_error', 'Customer not found' ) );

		$controller = new CustomerController();
		$request    = new WP_REST_Request( 'GET', '/surecart/v1/customers/me' );
		$request->set_param( 'mode', 'test' );

		$result = $controller->me( $request );

		$this->assertWPError( $result );
		$this->assertSame( 'api_error', $result->get_error_code() );
	}
}

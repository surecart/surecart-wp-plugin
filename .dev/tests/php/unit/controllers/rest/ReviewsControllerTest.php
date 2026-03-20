<?php

namespace SureCart\Tests\Controllers\Rest;

use SureCart\Controllers\Rest\ReviewsController;
use SureCart\Models\Review;
use SureCart\Models\User;
use SureCart\Request\RequestService;
use SureCart\Tests\SureCartUnitTestCase;
use WP_REST_Request;

class ReviewsControllerTest extends SureCartUnitTestCase {
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
	 * Test maybeSetUser returns error when not logged in.
	 *
	 * @group reviews
	 */
	public function test_maybeSetUser_returns_error_when_not_logged_in() {
		// Ensure no user is logged in.
		wp_set_current_user( 0 );

		$controller = \Mockery::mock( ReviewsController::class )->makePartial();
		$controller->shouldAllowMockingProtectedMethods();

		$model   = new Review();
		$request = new WP_REST_Request( 'POST', '/surecart/v1/reviews' );

		$result = $controller->maybeSetUser( $model, $request );

		$this->assertWPError( $result );
		$this->assertSame( 'surecart_rest_review_no_user', $result->get_error_code() );
		$this->assertSame( 401, $result->get_error_data()['status'] );
	}

	/**
	 * Test maybeSetUser returns error when customer creation fails.
	 *
	 * @group reviews
	 */
	public function test_maybeSetUser_returns_error_when_customer_creation_fails() {
		// Create and login a user without existing customer ID.
		$user_id = self::factory()->user->create(
			[
				'user_email'   => 'nocustomer@test.com',
				'display_name' => 'Test User',
			]
		);
		wp_set_current_user( $user_id );

		// Mock the request service to return an error for customer creation.
		$requests = \Mockery::mock( RequestService::class );
		\SureCart::alias(
			'request',
			function () use ( $requests ) {
				return call_user_func_array( [ $requests, 'makeRequest' ], func_get_args() );
			}
		);

		// First call: Search for existing customer by email - return empty
		$requests->shouldReceive( 'makeRequest' )
			->once()
			->withSomeOfArgs( 'customers' )
			->andReturn(
				(object) [
					'data' => [],
				]
			);

		// Second call: Create customer - return error
		$requests->shouldReceive( 'makeRequest' )
			->once()
			->withSomeOfArgs( 'customers' )
			->andReturn(
				new \WP_Error(
					'api_error',
					'Failed to create customer'
				)
			);

		$controller = \Mockery::mock( ReviewsController::class )->makePartial();
		$controller->shouldAllowMockingProtectedMethods();

		$model   = new Review();
		$request = new WP_REST_Request( 'POST', '/surecart/v1/reviews' );

		$result = $controller->maybeSetUser( $model, $request );

		$this->assertWPError( $result );
		$this->assertSame( 'api_error', $result->get_error_code() );
	}

	/**
	 * Test maybeSetUser sets customer ID when user already has one.
	 *
	 * @group reviews
	 */
	public function test_maybeSetUser_uses_existing_customer_id() {
		// Create user and set existing customer ID.
		$user_id = self::factory()->user->create(
			[
				'user_email' => 'existingcustomer@test.com',
			]
		);
		wp_set_current_user( $user_id );

		// Set existing customer ID on user meta.
		update_user_meta( $user_id, 'sc_customer_ids', [ 'live' => 'existing_customer_123' ] );

		$controller = \Mockery::mock( ReviewsController::class )->makePartial();
		$controller->shouldAllowMockingProtectedMethods();

		$model   = new Review();
		$request = new WP_REST_Request( 'POST', '/surecart/v1/reviews' );

		$result = $controller->maybeSetUser( $model, $request );

		$this->assertNotWPError( $result );
		$this->assertSame( 'existing_customer_123', $result['customer'] );
	}

	/**
	 * Test maybeSetUser creates customer and sets ID for new users.
	 *
	 * @group reviews
	 */
	public function test_maybeSetUser_creates_customer_for_new_user() {
		// Create user without customer ID.
		$user_id = self::factory()->user->create(
			[
				'user_email'   => 'newcustomer@test.com',
				'display_name' => 'New Customer',
			]
		);
		wp_set_current_user( $user_id );

		// Mock the request service to return a new customer.
		$requests = \Mockery::mock( RequestService::class );
		\SureCart::alias(
			'request',
			function () use ( $requests ) {
				return call_user_func_array( [ $requests, 'makeRequest' ], func_get_args() );
			}
		);

		// First call: Search for existing customer by email - return empty
		$requests->shouldReceive( 'makeRequest' )
			->once()
			->withSomeOfArgs( 'customers' )
			->andReturn(
				(object) [
					'data' => [],
				]
			);

		// Second call: Create new customer
		$requests->shouldReceive( 'makeRequest' )
			->once()
			->withSomeOfArgs( 'customers' )
			->andReturn(
				(object) [
					'id'        => 'new_customer_456',
					'email'     => 'newcustomer@test.com',
					'live_mode' => true,
				]
			);

		$controller = \Mockery::mock( ReviewsController::class )->makePartial();
		$controller->shouldAllowMockingProtectedMethods();

		$model   = new Review();
		$request = new WP_REST_Request( 'POST', '/surecart/v1/reviews' );

		$result = $controller->maybeSetUser( $model, $request );

		$this->assertNotWPError( $result );
		$this->assertSame( 'new_customer_456', $result['customer'] );
	}

	/**
	 * Test middleware only calls maybeSetUser for POST requests.
	 *
	 * @group reviews
	 */
	public function test_middleware_only_calls_maybeSetUser_for_post_requests() {
		$controller = \Mockery::mock( ReviewsController::class )->makePartial();
		$controller->shouldAllowMockingProtectedMethods();

		// POST request - should call maybeSetUser.
		$controller->shouldReceive( 'maybeSetUser' )
			->once()
			->andReturnUsing(
				function ( $model ) {
					return $model;
				}
			);

		$model        = new Review();
		$post_request = new WP_REST_Request( 'POST', '/surecart/v1/reviews' );
		$controller->middleware( $model, $post_request );
	}

	/**
	 * Test middleware does NOT call maybeSetUser for GET requests.
	 *
	 * @group reviews
	 */
	public function test_middleware_skips_maybeSetUser_for_get_requests() {
		$controller = \Mockery::mock( ReviewsController::class )->makePartial();
		$controller->shouldAllowMockingProtectedMethods();

		// GET request - should NOT call maybeSetUser.
		$controller->shouldNotReceive( 'maybeSetUser' );

		$model       = new Review();
		$get_request = new WP_REST_Request( 'GET', '/surecart/v1/reviews' );
		$controller->middleware( $model, $get_request );
	}

	/**
	 * Test middleware does NOT call maybeSetUser for PATCH requests.
	 *
	 * @group reviews
	 */
	public function test_middleware_skips_maybeSetUser_for_patch_requests() {
		$controller = \Mockery::mock( ReviewsController::class )->makePartial();
		$controller->shouldAllowMockingProtectedMethods();

		// PATCH request - should NOT call maybeSetUser.
		$controller->shouldNotReceive( 'maybeSetUser' );

		$model         = new Review();
		$patch_request = new WP_REST_Request( 'PATCH', '/surecart/v1/reviews' );
		$controller->middleware( $model, $patch_request );
	}
}

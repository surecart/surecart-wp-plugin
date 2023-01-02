<?php

namespace SureCart\Tests\Feature\Rest;

use SureCart\Request\RequestServiceProvider;
use SureCart\Rest\OrderRestServiceProvider;
use SureCart\Support\Errors\ErrorsServiceProvider;
use SureCart\Tests\SureCartUnitTestCase;
use WP_REST_Request;

class OrderRestServiceProviderTest extends SureCartUnitTestCase
{
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp()
	{
		parent::setUp();

		// Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers' => [
				OrderRestServiceProvider::class,
				RequestServiceProvider::class,
				ErrorsServiceProvider::class
			]
		], false);
	}

	/**
	 * @group failing
	 */
	public function test_can_cancel()
	{
		// mock the requests in the container
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		$requests->shouldReceive('makeRequest')
		->once()
		->withSomeOfArgs('orders/testid/cancel/')
		->andReturn([]);

		// unauthed.
		$request = new WP_REST_Request('PATCH', '/surecart/v1/orders/testid/cancel');
		$response = rest_do_request($request);
		$this->assertSame($response->get_status(), 401);

		// without cap
		$user = self::factory()->user->create_and_get();
		wp_set_current_user($user->ID);
		$request = new WP_REST_Request('PATCH', '/surecart/v1/orders/testid/cancel');
		$response = rest_do_request($request);
		$this->assertSame($response->get_status(), 403);

		// has cap.
		$user = self::factory()->user->create_and_get();
		$user->add_cap('edit_sc_orders');
		wp_set_current_user($user->ID);

		$request = new WP_REST_Request('PATCH', '/surecart/v1/orders/testid/cancel');
		$response = rest_do_request($request);
		$this->assertSame($response->get_status(), 200);
	}
}

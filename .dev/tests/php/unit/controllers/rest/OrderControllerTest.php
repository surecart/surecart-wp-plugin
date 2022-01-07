<?php

namespace CheckoutEngine\Tests\Controllers\Rest;

use CheckoutEngine\Controllers\Rest\OrderController;
use CheckoutEngine\Models\Order;
use CheckoutEngine\Tests\CheckoutEngineUnitTestCase;
use WP_REST_Request;

class OrderControllerTest extends CheckoutEngineUnitTestCase
{
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp()
	{
		// Set up an app instance with whatever stubs and mocks we need before every test.
		\CheckoutEngine::make()->bootstrap([
			'providers' => [
				\CheckoutEngine\Request\RequestServiceProvider::class,
			]
		], false);

		parent::setUp();
	}

	public function test_middleware()
	{
		$request = new WP_REST_Request('POST', '/checkout-engine/v1/checkout-session', [
			'form_id' => 1,
		]);

		$model = \Mockery::mock(Order::class)->makePartial();
		$model->shouldAllowMockingProtectedMethods()->shouldReceive('where')->once()->andReturn($model);
		$model->shouldAllowMockingProtectedMethods()->shouldReceive('create')->once()->andReturn($model);

		$controller = \Mockery::mock(OrderController::class)->makePartial();
		$controller->shouldAllowMockingProtectedMethods()->shouldReceive('middleware')->once()->andReturn($model);
		$controller->create($request);
	}
}

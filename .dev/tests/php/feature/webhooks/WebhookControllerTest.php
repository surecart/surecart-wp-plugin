<?php

namespace CheckoutEngine\Tests\Feature;

use CheckoutEngine\Controllers\Web\WebhookController;
use CheckoutEngine\Tests\CheckoutEngineUnitTestCase;
use CheckoutEngineCore\Requests\Request;

/**
 * @group webhooks
 */
class WebhookControllerTest extends CheckoutEngineUnitTestCase
{
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp()
	{
		parent::setUp();

		// Set up an app instance with whatever stubs and mocks we need before every test.
		\CheckoutEngine::make()->bootstrap([], false);
	}

	/**
	 * Checks that our recieve function calls the correct event.
	 * @group failing
	 */
	public function test_can_receive()
	{
		$this->assertEquals(did_action('checkout_engine/purchase_created'), 0);
		$controller = \Mockery::mock(WebhookController::class)->makePartial();
		$request = \Mockery::mock(Request::class)->makePartial();

		$request->shouldReceive('getParsedBody')
			->once()
			->andReturn([
				"id" => "e57979af-84f7-41e3-82e5-911cf24f13f5",
				"object" => "event",
				"data" => [
					"purchase" => "1ce4624d-2287-4d5b-bec7-b23689ae4461"
				],
				"type" => "purchase.created",
				"account" => "9f152260-0a22-4bf3-aaf9-5a2487c2bf59",
				"created_at" => 1643236542
			]);

		$result = $controller->receive($request);
		$this->assertSame($result->getStatusCode(), 200);
		$this->assertEquals(did_action('checkout_engine/purchase_created'), 1);
	}
}

<?php
namespace CheckoutEngine\Tests\Feature\Rest;

use CheckoutEngine\Controllers\Web\WebhookController;
use CheckoutEngine\Tests\CheckoutEngineUnitTestCase;

class WebhookRestHandleTest extends CheckoutEngineUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp()
	{
		parent::setUp();

		// Set up an app instance with whatever stubs and mocks we need before every test.
		\CheckoutEngine::make()->bootstrap([
		], false);
	}

	/**
	 * Checks that our recieve function calls the correct event.
	 */
	public function test_can_receive()
	{
		$this->assertEquals(did_action('checkout_engine/order_created'), 0);
		$controller = \Mockery::mock(WebhookController::class)->makePartial();

		$controller->shouldReceive('getInput')
			->once()
			->andReturn((object) [
				"id" => "3631d049-2ea4-4dca-acae-fd8110fab21f",
				"object" => "event",
				"data" => (object) [
					'id' => 'asdf',
				],
				"type" => "order.created",
				"account" => "9954af8d-5737-4a24-8d4f-b96a34a38019"
			]);

		$result = $controller->receive();
		$this->assertSame($result->getStatusCode(), 200);
		$this->assertEquals(did_action('checkout_engine/order_created'), 1);
	}
}

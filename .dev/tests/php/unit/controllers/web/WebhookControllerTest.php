<?php

namespace SureCart\Tests\Controllers\Rest;

use SureCart\Controllers\Web\WebhookController;
use SureCart\Tests\SureCartUnitTestCase;

class WebhookControllerTest extends SureCartUnitTestCase
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
				\SureCart\WordPress\PluginServiceProvider::class,
			]
		], false);
	}

	/**
	 * @group webhooks
	 */
	public function test_creates_event_name()
	{
		$controller = new WebhookController();
		$this->assertSame('surecart/order_created', $controller->createEventName('order.created'));
		$this->assertSame('surecart/order_finalized', $controller->createEventName('order.finalized'));
		$this->assertSame('surecart/order_paid', $controller->createEventName('order.paid'));
		$this->assertSame('surecart/order_updated', $controller->createEventName('order.updated'));

		$this->assertSame('surecart/refund_created', $controller->createEventName('refund.created'));
		$this->assertSame('surecart/refund_updated', $controller->createEventName('refund.updated'));

		$this->assertSame('surecart/subscription_cancelled', $controller->createEventName('subscription.cancelled'));
		$this->assertSame('surecart/subscription_created', $controller->createEventName('subscription.created'));
		$this->assertSame('surecart/subscription_updated', $controller->createEventName('subscription.updated'));
	}

	/**
	 * @group webhooks
	 */
	public function testGetObjectId()
	{
	 	$controller = new WebhookController();
		$request =  (object) [
			'data' => (object) [
				'object' => (object) [
					'object' => 'purchase',
					'id' => 'test_id',
				],
			]
		];

	 	$this->assertSame('test_id', $controller->getObjectId($request->data));
	}

	/**
	 * @group webhooks
	 */
	public function test_receive_should_return_200_if_no_matching_model() {
		$controller = new WebhookController();
		$request = \Mockery::mock(\SureCartCore\Requests\Request\Request::class)->makePartial();
		$request->shouldReceive('getHeaderLine')->andReturn('');
		$request->shouldReceive('getParsedBody')->andReturn([
			'data' => [
				'object' => [
					'object' => 'asdfasdfasdf',
					'id' => 'test_id',
				],
			]
		]);
		$this->assertSame('{"event_triggered":"none"}', $controller->receive($request)->getBody()->getContents());
		$this->assertSame(200, $controller->receive($request)->getStatusCode());
	}

	/**
	 * @group webhooks
	 */
	public function test_receive_should_respond_success() {
		$controller = new WebhookController();
		$request = \Mockery::mock(\SureCartCore\Requests\Request\Request::class)->makePartial();
		$request->shouldReceive('getHeaderLine')->andReturn('');
		$request->shouldReceive('getParsedBody')->andReturn([
			'type' => 'purchase.created',
			'data' => [
				'object' => [
					'object' => 'purchase',
					'id' => 'test_id',
				],
			]
		]);
		$this->assertSame('{"event_triggered":"surecart\/purchase_created","data":{"event":"surecart\/purchase_created","id":"","request":{"type":"purchase.created","data":{"object":{"object":"purchase","id":"test_id"}}}}}', $controller->receive($request)->getBody()->getContents());
		$this->assertSame(200, $controller->receive($request)->getStatusCode());
	}
}

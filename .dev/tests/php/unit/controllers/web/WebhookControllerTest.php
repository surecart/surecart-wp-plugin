<?php

namespace SureCart\Tests\Controllers\Rest;

use SureCart\Controllers\Web\WebhookController;
use SureCart\Tests\SureCartUnitTestCase;

class WebhookControllerTest extends SureCartUnitTestCase
{
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
}

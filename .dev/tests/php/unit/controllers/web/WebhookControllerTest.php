<?php

namespace CheckoutEngine\Tests\Controllers\Rest;

use CheckoutEngine\Controllers\Web\WebhookController;
use CheckoutEngine\Tests\CheckoutEngineUnitTestCase;

class WebhookControllerTest extends CheckoutEngineUnitTestCase
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

	public function testObjectIdAndName()
	{
	 	$controller = new WebhookController();
		$data =  (object) [
			'subscription' => '3631d049-2ea4-4dca-acae-fd8110fab21f'
		];
	 	$this->assertSame('3631d049-2ea4-4dca-acae-fd8110fab21f', $controller->getObjectId($data));
		$this->assertSame('subscription', $controller->getObjectName($data));
	}
}

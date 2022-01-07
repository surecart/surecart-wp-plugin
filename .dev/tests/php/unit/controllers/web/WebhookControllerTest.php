<?php

namespace CheckoutEngine\Tests\Controllers\Rest;

use CheckoutEngine\Controllers\Web\WebhookController;
use CheckoutEngine\Tests\CheckoutEngineUnitTestCase;

class WebhookControllerTest extends CheckoutEngineUnitTestCase
{
	public function test_creates_event_name()
	{
		$controller = new WebhookController();
		$this->assertSame('checkout_engine/events/order_created', $controller->createEventName('order.created'));
		$this->assertSame('checkout_engine/events/order_finalized', $controller->createEventName('order.finalized'));
		$this->assertSame('checkout_engine/events/order_paid', $controller->createEventName('order.paid'));
		$this->assertSame('checkout_engine/events/order_updated', $controller->createEventName('order.updated'));

		$this->assertSame('checkout_engine/events/refund_created', $controller->createEventName('refund.created'));
		$this->assertSame('checkout_engine/events/refund_updated', $controller->createEventName('refund.updated'));

		$this->assertSame('checkout_engine/events/subscription_cancelled', $controller->createEventName('subscription.cancelled'));
		$this->assertSame('checkout_engine/events/subscription_created', $controller->createEventName('subscription.created'));
		$this->assertSame('checkout_engine/events/subscription_updated', $controller->createEventName('subscription.updated'));
	}
}

<?php

use CheckoutEngine\Middleware\WebhooksMiddleware;
use CheckoutEngine\Tests\CheckoutEngineUnitTestCase;

class WebhookMiddlewareTest extends CheckoutEngineUnitTestCase {
	/**
	 * @group failing
	 */
	public function getTimestamp() {
		$_SERVER['x-webhook-timestamp'] = 1641873601;
		$this->assertSame((new WebhooksMiddleware())->getTimestamp(), 1641873601);
	}

	/**
	 * @group failing
	 */
	public function getSignature() {
		$_SERVER['x-webhook-signature'] = 'signature';
		$this->assertSame((new WebhooksMiddleware())->getSignature(), 'signature');
	}

	/**
	 * @group failing
	 */
	public function test_getSignedPayload()
	{
		$middleware = \Mockery::mock(WebhooksMiddleware::class)->makePartial();

		$middleware->shouldReceive('getSignature')->andReturn('signature');
		$middleware->shouldReceive('getTimestamp')->andReturn(12345);

		$this->assertSame($middleware->getSignedPayload(), 'signature.12345');
	}

	/**
	 * @group failing
	 */
	public function test_computeHash() {
		$expected = hash_hmac( 'sha256', 'something.else', 'signing_secret' );

		$middleware = \Mockery::mock(WebhooksMiddleware::class)->makePartial();
		$middleware->shouldReceive('getSignedPayload')->andReturn('something.else');
		$middleware->shouldReceive('getSigningSecret')->andReturn('signing_secret');

		$this->assertSame($middleware->computeHash(), $expected);
	}
}

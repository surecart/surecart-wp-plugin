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

		$middleware->shouldReceive('getInput')->andReturn(['test'=> 'test']);
		$middleware->shouldReceive('getTimestamp')->andReturn(12345);

		$this->assertSame($middleware->getSignedPayload(), '12345.' . json_encode(['test'=> 'test']));
	}

	/**
	 * @group failing
	 */
	public function test_computeHash() {
		$payload = json_encode(['test' => '1234']);
		$secret = 'secret';
		$timestamp = 1641873601;
		$signature = hash_hmac( 'sha256', "$timestamp.$payload", $secret );

		$middleware = \Mockery::mock(WebhooksMiddleware::class)->makePartial();

		$middleware->shouldReceive('getSignature')->andReturn($signature);
		$middleware->shouldReceive('getTimestamp')->andReturn($timestamp);
		$middleware->shouldReceive('getInput')->andReturn(['test' => '1234']);
		$middleware->shouldReceive('getSigningSecret')->andReturn($secret);

		$this->assertSame($middleware->computeHash(), $signature, 'Hash should be computed correctly');
	}
}

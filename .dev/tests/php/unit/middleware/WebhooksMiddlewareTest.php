<?php

use SureCart\Middleware\WebhooksMiddleware;
use SureCart\Tests\SureCartUnitTestCase;

/**
 * @group webhooks
 */
class WebhookMiddlewareTest extends SureCartUnitTestCase {
	public function test_getSignedPayload()
	{
		$middleware = \Mockery::mock(WebhooksMiddleware::class)->makePartial();

		$middleware->shouldReceive('getBody')->andReturn(json_encode(['test'=> 'test']));
		$middleware->shouldReceive('getTimestamp')->andReturn(12345);

		$this->assertSame($middleware->getSignedPayload(), '12345.' . json_encode(['test'=> 'test']));
	}

	public function test_computeHash() {
		$payload = json_encode(['test' => '1234']);
		$secret = 'secret';
		$timestamp = 1641873601;
		$signature = hash_hmac( 'sha256', "$timestamp.$payload", $secret );

		$middleware = \Mockery::mock(WebhooksMiddleware::class)->makePartial();

		$middleware->shouldReceive('getSignature')->andReturn($signature);
		$middleware->shouldReceive('getTimestamp')->andReturn($timestamp);
		$middleware->shouldReceive('getBody')->andReturn($payload);
		$middleware->shouldReceive('getSigningSecret')->andReturn($secret);

		$this->assertSame($middleware->computeHash(), $signature, 'Hash should be computed correctly');
	}
}

<?php

use CheckoutEngine\Middleware\WebhooksMiddleware;
use CheckoutEngine\Tests\CheckoutEngineUnitTestCase;

/**
 * @group webhooks
 */
class WebhookMiddlewareFeatureTest extends CheckoutEngineUnitTestCase {
	public function test_verifies_signature() {
		$payload = json_encode(['test' => '1234']);
		$secret = 'secret';
		$timestamp = 1641873601;
		$signature = hash_hmac( 'sha256', "$timestamp.$payload", $secret );

		$middleware = \Mockery::mock(WebhooksMiddleware::class)->makePartial();

		$middleware->shouldReceive('getSignature')->andReturn($signature);
		$middleware->shouldReceive('getTimestamp')->andReturn($timestamp);
		$middleware->shouldReceive('getBody')->andReturn($payload);
		$middleware->shouldReceive('getSigningSecret')->andReturn($secret);

		$this->assertTrue($middleware->verifySignature());
	}

}

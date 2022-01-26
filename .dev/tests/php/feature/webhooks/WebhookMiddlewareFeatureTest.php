<?php

use CheckoutEngine\Middleware\WebhooksMiddleware;
use CheckoutEngine\Tests\CheckoutEngineUnitTestCase;

class WebhookMiddlewareFeatureTest extends CheckoutEngineUnitTestCase {
	/**
	 * @group failing
	 */
	public function test_verifies_signature() {
		$payload = [[
			'data' => [
				'test' => '1234'
			]
		]];

		$timestamp = 1641873601;
		$secret = 'secret';
		$signature_hash = hash_hmac( 'sha256', json_encode( $payload ), $secret );
		$signed_payload = $signature_hash . '.' . $timestamp;

		$middleware = \Mockery::mock(WebhooksMiddleware::class)->makePartial();

		// $middleware->shouldReceive('getSigningSecret')
		// 	->once()
		// 	->andReturn($secret);

		// $middleware->shouldReceive('getInput')
		// 	->once()
		// 	->andReturn(json_encode($payload));

		// $middleware->shouldReceive('getSignedPayload')
		// 	->once()
		// 	->andReturn($signature_hash . '.' . $timestamp);

		$middleware->shouldReceive('getSignature')
			->once()
			->andReturn($signature_hash);

		$this->assertTrue($middleware->verifySignature());
	}
}

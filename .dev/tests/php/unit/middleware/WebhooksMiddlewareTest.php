<?php

use SureCart\Middleware\WebhooksMiddleware;
use SureCart\Tests\SureCartUnitTestCase;

/**
 * @group webhooks
 */
class WebhookMiddlewareTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

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

	/**
	 * CVE-2026-7655 — verifySignature() must fail closed when the signing secret
	 * is an empty string. Previously the HMAC was keyed with '' and an attacker
	 * who pre-computed the empty-key HMAC could pass the check.
	 */
	public function test_verifySignature_returns_false_when_secret_is_empty_string() {
		$middleware = \Mockery::mock(WebhooksMiddleware::class)->makePartial();
		$middleware->shouldReceive('getSigningSecret')->andReturn('');
		// computeHash MUST NOT be called — assert it via Mockery (call would be unexpected on the partial).
		$middleware->shouldNotReceive('computeHash');

		$this->assertFalse( $middleware->verifySignature() );
	}

	/**
	 * CVE-2026-7655 — verifySignature() must also fail closed when the secret
	 * resolves to null (e.g. no webhook registered, model returned null).
	 */
	public function test_verifySignature_returns_false_when_secret_is_null() {
		$middleware = \Mockery::mock(WebhooksMiddleware::class)->makePartial();
		$middleware->shouldReceive('getSigningSecret')->andReturn(null);
		$middleware->shouldNotReceive('computeHash');

		$this->assertFalse( $middleware->verifySignature() );
	}

	/**
	 * Sanity check: with a registered secret, a correctly-signed request passes.
	 */
	public function test_verifySignature_returns_true_for_valid_signature() {
		$payload   = json_encode( [ 'event' => 'customer.updated' ] );
		$secret    = 'whk_secret_abc123';
		$timestamp = 1641873601;
		$signature = hash_hmac( 'sha256', "$timestamp.$payload", $secret );

		$middleware = \Mockery::mock( WebhooksMiddleware::class )->makePartial();
		$middleware->shouldReceive( 'getSigningSecret' )->andReturn( $secret );
		$middleware->shouldReceive( 'getTimestamp' )->andReturn( $timestamp );
		$middleware->shouldReceive( 'getBody' )->andReturn( $payload );
		$middleware->shouldReceive( 'getSignature' )->andReturn( $signature );

		$this->assertTrue( $middleware->verifySignature() );
	}

	/**
	 * An incorrect signature must be rejected even when a secret is registered.
	 * Comparison uses hash_equals() — see CVE-2026-7655.
	 */
	public function test_verifySignature_returns_false_for_invalid_signature() {
		$payload   = json_encode( [ 'event' => 'customer.updated' ] );
		$secret    = 'whk_secret_abc123';
		$timestamp = 1641873601;

		$middleware = \Mockery::mock( WebhooksMiddleware::class )->makePartial();
		$middleware->shouldReceive( 'getSigningSecret' )->andReturn( $secret );
		$middleware->shouldReceive( 'getTimestamp' )->andReturn( $timestamp );
		$middleware->shouldReceive( 'getBody' )->andReturn( $payload );
		$middleware->shouldReceive( 'getSignature' )->andReturn( 'not-a-valid-signature' );

		$this->assertFalse( $middleware->verifySignature() );
	}

	/**
	 * Backward compatibility: computeHash() still works when called with no args
	 * (falls back to getSigningSecret()), preserving the existing public surface.
	 */
	public function test_computeHash_falls_back_to_getSigningSecret_when_no_arg() {
		$payload   = json_encode( [ 'test' => '1234' ] );
		$secret    = 'fallback_secret';
		$timestamp = 1641873601;
		$expected  = hash_hmac( 'sha256', "$timestamp.$payload", $secret );

		$middleware = \Mockery::mock( WebhooksMiddleware::class )->makePartial();
		$middleware->shouldReceive( 'getTimestamp' )->andReturn( $timestamp );
		$middleware->shouldReceive( 'getBody' )->andReturn( $payload );
		$middleware->shouldReceive( 'getSigningSecret' )->andReturn( $secret );

		$this->assertSame( $expected, $middleware->computeHash() );
	}

	/**
	 * computeHash() also accepts an explicit secret argument so verifySignature()
	 * doesn't have to fetch the secret twice.
	 */
	public function test_computeHash_accepts_explicit_secret() {
		$payload   = json_encode( [ 'test' => '1234' ] );
		$secret    = 'explicit_secret';
		$timestamp = 1641873601;
		$expected  = hash_hmac( 'sha256', "$timestamp.$payload", $secret );

		$middleware = \Mockery::mock( WebhooksMiddleware::class )->makePartial();
		$middleware->shouldReceive( 'getTimestamp' )->andReturn( $timestamp );
		$middleware->shouldReceive( 'getBody' )->andReturn( $payload );

		$this->assertSame( $expected, $middleware->computeHash( $secret ) );
	}
}

<?php

namespace CheckoutEngine\Middleware;

use CheckoutEngine\Models\Webhook;
use Closure;
use CheckoutEngineCore\Requests\RequestInterface;

/**
 * Middleware for handling model archiving.
 */
class WebhooksMiddleware {
	/**
	 * Handle the middleware.
	 *
	 * @param RequestInterface $request Request.
	 * @param Closure          $next Next.
	 * @return function
	 */
	public function handle( RequestInterface $request, Closure $next ) {
		// verify the signature before handling.
		if ( ! $this->verifySignature() ) {
			return \CheckoutEngine::json( [ 'error' => 'Invalid signature' ] )->withStatus( 400 );
		}
		return $next( $request );
	}

	/**
	 * Verify the signature.
	 *
	 * @return bool
	 */
	public function verifySignature() {
		// get the signature.
		$signature = $this->getSignature();
		// get the signing secret secret.
		$secret = Webhook::getSigningSecret();
		// Prepare Signed Payload String.
		$payload = $this->getSignedPayload();
		// Compute an HMAC with the SHA256 hash function. Use the endpoint’s signing secret as the key, and use the signed_payload string as the message.
		$expected = hash_hmac( 'sha256', $payload, $secret );
		// Compare the signature in the header to the expected signature.
		return $expected === $signature;
	}

	/**
	 * Get the webhook signature.
	 *
	 * @return string
	 */
	public function getSignature() {
		return $_SERVER['x-webhook-signature'] ?? '';
	}

	/**
	 * Get the webhook timestamp.
	 *
	 * @return string
	 */
	public function getTimestamp() {
		return $_SERVER['x-webhook-timestamp'] ?? '';
	}

	/**
	 * Get the signed payload.
	 *
	 * @return string
	 */
	public function getSignedPayload() {
		return $this->getSignature() . '.' . $this->getTimestamp();
	}
}

<?php

namespace CheckoutEngine\Middleware;

use Closure;
use CheckoutEngineCore\Requests\RequestInterface;
use CheckoutEngineCore\Responses\RedirectResponse;

/**
 * Middleware for handling model archiving.
 */
class NonceMiddleware {
	/**
	 * Handle the middleware.
	 *
	 * @param RequestInterface $request Request.
	 * @param Closure          $next Next.
	 * @param string           $model_name Model name.
	 * @return function
	 */
	public function handle( RequestInterface $request, Closure $next, $nonce_name ) {
		if ( ! $request->query( 'nonce' ) ) {
			wp_die( esc_html__( 'Something is wrong with the provided link.', 'checkout_engine' ) );
			exit;
		}

		// check nonce.
		if ( ! wp_verify_nonce( $request->query( 'nonce' ), $nonce_name ) ) {
			wp_die( esc_html__( 'Your session expired - please try again.', 'checkout_engine' ) );
			exit;
		}

		return $next( $request );
	}
}

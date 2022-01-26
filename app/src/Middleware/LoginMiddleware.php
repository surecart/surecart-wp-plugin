<?php

namespace CheckoutEngine\Middleware;

use Closure;
use CheckoutEngineCore\Requests\RequestInterface;
use CheckoutEngineCore\Responses\RedirectResponse;

class LoginMiddleware {
	// Note the new $capability parameter:
	public function handle( RequestInterface $request, Closure $next, $model_name ) {
		// check nonce.
		if ( ! $request->query( 'nonce' ) || ! wp_verify_nonce( $request->query( 'nonce' ), 'ce_login' ) ) {
			\CheckoutEngine::flash()->add( 'errors', __( 'Your session expired - please try again.', 'checkout_engine' ) );
			return ( new RedirectResponse( $request ) )->back();
		}

		return $next( $request );
	}
}

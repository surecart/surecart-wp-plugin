<?php

namespace SureCart\Middleware;

use Closure;
use SureCartCore\Requests\RequestInterface;
use SureCartCore\Responses\RedirectResponse;

class LoginMiddleware {
	// Note the new $capability parameter:
	public function handle( RequestInterface $request, Closure $next, $model_name ) {
		// check nonce.
		if ( ! $request->query( 'nonce' ) || ! wp_verify_nonce( $request->query( 'nonce' ), 'ce_login' ) ) {
			\SureCart::flash()->add( 'errors', __( 'Your session expired - please try again.', 'surecart' ) );
			return ( new RedirectResponse( $request ) )->back();
		}

		return $next( $request );
	}
}

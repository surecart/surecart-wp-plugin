<?php

namespace CheckoutEngine\Middleware;

use Closure;
use WPEmerge\Requests\RequestInterface;
use WPEmerge\Responses\ResponseService;
use WPEmerge\Responses\RedirectResponse;

class ArchiveModelMiddleware {
	// Note the new $capability parameter:
	public function handle( RequestInterface $request, Closure $next, $model_name ) {
		// check nonce.
		if ( ! $request->query( 'nonce' ) || ! wp_verify_nonce( $request->query( 'nonce' ), "archive_$model_name" ) ) {
			\CheckoutEngine::flash()->add( 'errors', __( 'Your session expired - please try again.', 'checkout_engine' ) );
			return ( new RedirectResponse( $request ) )->back();
		}

		return $next( $request );
	}
}

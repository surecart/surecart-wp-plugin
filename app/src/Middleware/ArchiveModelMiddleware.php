<?php

namespace CheckoutEngine\Middleware;

use Closure;
use CheckoutEngineCore\Requests\RequestInterface;
use CheckoutEngineCore\Responses\RedirectResponse;

/**
 * Middleware for handling model archiving.
 */
class ArchiveModelMiddleware {
	/**
	 * Handle the middleware.
	 *
	 * @param RequestInterface $request Request.
	 * @param Closure          $next Next.
	 * @param string           $model_name Model name.
	 * @return function
	 */
	public function handle( RequestInterface $request, Closure $next, $model_name ) {
		// check nonce.
		if ( ! $request->query( 'nonce' ) || ! wp_verify_nonce( $request->query( 'nonce' ), "archive_$model_name" ) ) {
			\CheckoutEngine::flash()->add( 'errors', __( 'Your session expired - please try again.', 'checkout_engine' ) );
			return ( new RedirectResponse( $request ) )->back();
		}

		return $next( $request );
	}
}

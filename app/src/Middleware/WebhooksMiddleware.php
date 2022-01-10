<?php

namespace CheckoutEngine\Middleware;

use Closure;
use WPEmerge\Requests\RequestInterface;

/**
 * Middleware for handling model archiving.
 */
class WebhooksMiddleware {
	/**
	 * Handle the middleware.
	 *
	 * @param RequestInterface $request Request.
	 * @param Closure          $next Next.
	 * @param string           $model_name Model name.
	 * @return function
	 */
	public function handle( RequestInterface $request, Closure $next ) {
		// TODO: verify signature.
		if ( false ) {
			return \CheckoutEngine::json( [ 'failed' => true ] )->withStatus( 400 );
		}
		return $next( $request );
	}
}

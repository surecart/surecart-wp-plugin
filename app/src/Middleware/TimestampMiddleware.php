<?php

namespace SureCart\Middleware;

use Closure;
use SureCartCore\Requests\RequestInterface;
use SureCartCore\Responses\RedirectResponse;

/**
 * Appends a timestamp to the request to bypass any request caching.
 */
class TimeStampMiddleware {
	/**
	 * Handle the middleware.
	 *
	 * @param RequestInterface $request Request.
	 * @param Closure          $next Next.
	 * @return function
	 */
	public function handle( RequestInterface $request, Closure $next ) {
		if ( $request->query( 't' ) ) {
			return $next( $request );
		}
		return ( new RedirectResponse( $request ) )->to( add_query_arg( array_merge( $request->getQueryParams(), [ 't' => time() ] ), $request->getRequestTarget() ) );
	}
}

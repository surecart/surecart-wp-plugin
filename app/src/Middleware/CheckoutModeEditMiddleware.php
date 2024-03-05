<?php

namespace SureCart\Middleware;

use Closure;
use SureCartCore\Requests\RequestInterface;

/**
 * Middleware for handling checkout mode.
 */
class CheckoutModeEditMiddleware {
	/**
	 * Enqueue component assets.
	 *
	 * @param RequestInterface $request Request.
	 * @param Closure          $next Next.
	 * @return function
	 */
	public function handle( RequestInterface $request, Closure $next ) {
		// cannot find checkout page.
		return $next( $request );
	}
}

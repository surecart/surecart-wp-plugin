<?php

namespace CheckoutEngine\Middleware;

use Closure;
use WPEmerge\Requests\RequestInterface;
use WPEmerge\Responses\RedirectResponse;

/**
 * Middleware for handling model archiving.
 */
class WebhookMiddleware {
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
		return $next( $request );
	}
}

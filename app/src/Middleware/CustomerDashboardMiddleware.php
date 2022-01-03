<?php

namespace CheckoutEngine\Middleware;

use Closure;
use WPEmerge\Requests\RequestInterface;

/**
 * Middleware for customer dashboard.
 */
class CustomerDashboardMiddleware {
	/**
	 * Handle the middleware.
	 *
	 * @param RequestInterface $request Request.
	 * @param Closure          $next Next.
	 * @return method
	 */
	public function handle( RequestInterface $request, Closure $next ) {
		if ( ! is_user_logged_in() ) {
			$return_url = $request->getUrl();
			$login_url  = wp_login_url( $return_url );
			return \CheckoutEngine::redirect()->to( $login_url );
		}

		return $next( $request );
	}
}

<?php

namespace SureCart\Middleware;

use Closure;
use SureCartCore\Requests\RequestInterface;
use SureCartCore\Responses\RedirectResponse;

/**
 * Middleware for customer dashboard.
 */
class CustomerDashboardRedirectMiddleware {
	/**
	 * Enqueue component assets.
	 *
	 * @param RequestInterface $request Request.
	 * @param Closure          $next Next.
	 * @return function
	 */
	public function handle( RequestInterface $request, Closure $next ) {
		$customer_id = $request->query( 'customer_id' );

		// need a path and a customer id.
		if ( empty( $customer_id ) ) {
			return $next( $request );
		}

		return ( new RedirectResponse( $request ) )->to(
			esc_url_raw( remove_query_arg( 'customer_id', add_query_arg( (array) $request->query(), \SureCart::pages()->url( 'dashboard' ) ) ) )
		);
	}
}

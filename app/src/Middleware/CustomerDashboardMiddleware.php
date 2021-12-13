<?php

namespace CheckoutEngine\Middleware;

use CheckoutEngine\Models\User;
use Closure;
use WPEmerge\Requests\RequestInterface;

class CustomerDashboardMiddleware {
	// Note the new $capability parameter:
	public function handle( RequestInterface $request, Closure $next ) {
		if ( ! is_user_logged_in() ) {
			$return_url = $request->getUrl();
			$login_url  = wp_login_url( $return_url );
			return \CheckoutEngine::redirect()->to( $login_url );
		}

		// TODO: Handle if logged in an not yet a customer.
		$customer = User::current()->customer();
		if ( ! $customer ) {
			$return_url = $request->getUrl();
			$login_url  = wp_login_url( $return_url );
			return \CheckoutEngine::redirect()->to( $login_url );
		}

		return $next( $request );
	}
}

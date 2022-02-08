<?php

namespace CheckoutEngine\Middleware;

use CheckoutEngine\Models\CustomerLink;
use Closure;
use CheckoutEngineCore\Requests\RequestInterface;

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
		$link_id = $request->query( 'customer_link_id' );

		// use original page view if no customer link id is found.
		if ( ! $link_id ) {
			return $next( $request );
		}

		// get the customer link by id.
		$link = CustomerLink::find( $link_id );
		if ( is_wp_error( $link ) ) {
			return $this->error( $link );
		}
		if ( false !== $link->expired ) {
			return $this->error( new \WP_Error( 'link_expired', 'This link has expired.' ) );
		}

		// login the user using the customer id from the link.
		$user = $link->getUser();
		if ( ! $user ) {
			return $this->error( new \WP_Error( 'not_a_customer', 'It looks like you are not yet a customer.' ) );
		}

		$user->login();

		return $next( $request );
	}

	/**
	 * Handle errors.
	 *
	 * @param \WP_Error $error Error.
	 * @return wp_die
	 */
	public function error( $error ) {
		if ( $error->get_error_code() === 'customer_link.expired' ) {
			return wp_die( esc_html__( 'This link has expired.', 'checkout_engine' ) );
		}
		return wp_die( wp_kses_post( $error->get_error_message() ) );
	}
}

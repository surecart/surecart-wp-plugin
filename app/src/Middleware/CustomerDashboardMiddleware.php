<?php

namespace CheckoutEngine\Middleware;

use CheckoutEngine\Models\CustomerLink;
use CheckoutEngine\Models\User;
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
	public function handle( $request, Closure $next ) {
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

		$user = User::getUserBy( 'email', $link->email );
		if ( $user ) {
			$user->login();
			return $next( $request );
		}

		// login the user using the customer id from the link.
		$user = $link->getUser();
		if ( $user ) {
			$user->login();
			return $next( $request );
		}

		// there's no user with this email or customer id. Let's create one.
		if ( $link->customer ) {
			$user = User::create(
				[
					'user_name'  => $link->email,
					'user_email' => $link->email,
				]
			);

			if ( $user ) {
				$user->setCustomerId( $link->customer );
				$user->login();
				return $next( $request );
			}
		}

		return $this->error( new \WP_Error( 'user_not_found', 'This user was not found.' ) );
	}

	/**
	 * Handle errors.
	 *
	 * @param \WP_Error $error Error.
	 * @return wp_die
	 */
	public function error( $error ) {
		if ( $error->get_error_code() === 'customer_link.expired' ) {
			return wp_die( esc_html__( 'This link has expired.', 'surecart' ) );
		}
		return wp_die( wp_kses_post( $error->get_error_message() ) );
	}
}

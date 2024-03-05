<?php

namespace SureCart\Middleware;

use Closure;
use SureCartCore\Requests\RequestInterface;

/**
 * Middleware for handling checkout mode.
 */
class CheckoutModeMiddleware {
	/**
	 * Enqueue component assets.
	 *
	 * @param RequestInterface $request Request.
	 * @param Closure          $next Next.
	 * @return function
	 */
	public function handle( RequestInterface $request, Closure $next ) {
		// Check nonce.
		if ( ! $request->query( 'nonce' ) || ! wp_verify_nonce( $request->query( 'nonce' ), "update_checkout_mode" ) ) {
			wp_die( __( 'Your session expired - please try again.', 'surecart' ) );
		}

		// Check permission to edit the post.
		if ( ! current_user_can( 'edit_post',  get_the_ID() ) ) {
			wp_die( __( 'You do not have permission do this.', 'surecart' ) );
		}

		return $next( $request );
	}
}

<?php
namespace SureCartBlocks\Controllers\Middleware;

use Closure;

/**
 * Handles nonce check for controller.
 */
class SubscriptionNonceVerificationMiddleware {
	/**
	 * Handle the middleware.
	 *
	 * @param string  $action Action.
	 * @param Closure $next Next.
	 * @return function
	 */
	public function handle( string $action, Closure $next ) {
		// get nonce from URL.
		$nonce = $_REQUEST['nonce'] ?? '';

		if ( empty( $nonce ) ) {
			wp_die( esc_html__( 'Something is wrong with the provided link.', 'surecart' ) );
			exit;
		}

		// check nonce.
		if ( ! wp_verify_nonce( $nonce, 'subscription-switch' ) ) {
			wp_die( esc_html__( 'Your session expired - please try again.', 'surecart' ) );
			exit;
		}

		return $next();
	}
}

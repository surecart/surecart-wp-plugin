<?php

namespace CheckoutEngine\Middleware;

use Closure;
use CheckoutEngineCore\Requests\RequestInterface;
use CheckoutEngineCore\Responses\RedirectResponse;

/**
 * Middleware for handling model archiving.
 */
class EditModelMiddleware {
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
		if ( ! $request->query( 'nonce' ) || ! wp_verify_nonce( $request->query( 'nonce' ), "edit_$model_name" ) ) {
			\CheckoutEngine::flash()->add( 'errors', __( 'Your session expired - please try again.', 'surecart' ) );
			return ( new RedirectResponse( $request ) )->back();
		}

		if ( ! current_user_can( "edit_ce_{$model_name}s" ) ) {
			\CheckoutEngine::flash()->add( 'errors', __( 'You do not have permission do this.', 'surecart' ) );
			return ( new RedirectResponse( $request ) )->back();
		}

		return $next( $request );
	}
}

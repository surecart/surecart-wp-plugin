<?php

namespace SureCart\Middleware;

use Closure;
use SureCartCore\Requests\RequestInterface;
use SureCartCore\Responses\RedirectResponse;

/**
 * Middleware for handling model archiving.
 */
class ArchiveModelMiddleware {
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
		if ( ! $request->query( 'nonce' ) || ! wp_verify_nonce( $request->query( 'nonce' ), "archive_$model_name" ) ) {
			\SureCart::flash()->add( 'errors', __( 'Your session expired - please try again.', 'surecart' ) );
			return ( new RedirectResponse( $request ) )->back();
		}

		if ( ! current_user_can( "edit_ce_{$model_name}s" ) ) {
			\SureCart::flash()->add( 'errors', __( 'You do not have permission do this.', 'surecart' ) );
			return ( new RedirectResponse( $request ) )->back();
		}

		return $next( $request );
	}
}

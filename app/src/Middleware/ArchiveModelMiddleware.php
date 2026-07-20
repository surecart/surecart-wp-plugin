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
	 * @param string           $model_name Model name (used for the nonce, e.g. `archive_{$model_name}`).
	 * @param string|null      $capability Optional capability override. When omitted, defaults to
	 *                                     `edit_sc_{$model_name}s`. Passed via `archive_model:foo,my_cap`
	 *                                     when a sibling entity rides on another model's capability.
	 * @return function
	 */
	public function handle( RequestInterface $request, Closure $next, $model_name, $capability = null ) {
		// check nonce.
		if ( ! $request->query( 'nonce' ) || ! wp_verify_nonce( $request->query( 'nonce' ), "archive_$model_name" ) ) {
			wp_die( esc_html__( 'Your session expired - please try again.', 'surecart' ) );
		}

		$capability = $capability ? $capability : "edit_sc_{$model_name}s";

		if ( ! current_user_can( $capability ) ) {
			wp_die( esc_html__( 'You do not have permission to do this.', 'surecart' ) );
		}

		return $next( $request );
	}
}

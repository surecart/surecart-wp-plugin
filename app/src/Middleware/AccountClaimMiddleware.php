<?php

namespace SureCart\Middleware;

use Closure;
use SureCart\Models\Account;
use SureCartCore\Requests\RequestInterface;

/**
 * Middleware for handling model archiving.
 */
class AccountClaimMiddleware {
	/**
	 * Handle the middleware.
	 *
	 * @param RequestInterface $request Request.
	 * @param Closure          $next Next.
	 * @param string           $model_name Model name.
	 * @return function
	 */
	public function handle( RequestInterface $request, Closure $next ) {
		$account = Account::find();

		if ( $account->claimed ) {
			// render success.
			return \SureCart::redirect()->to( esc_url_raw( add_query_arg( [ 'account_claimed_success' => true ], \SureCart::routeUrl( 'dashboard.show' ) ) ) );
		}

		return \SureCart::redirect()->to( esc_url_raw( $account->claim_url ) );
	}
}

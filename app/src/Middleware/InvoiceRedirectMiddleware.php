<?php

namespace SureCart\Middleware;

use Closure;
use SureCart\Models\Invoice;
use SureCartCore\Requests\RequestInterface;
use SureCartCore\Responses\RedirectResponse;

/**
 * Middleware for handling invoice redirects.
 */
class InvoiceRedirectMiddleware {

	/**
	 * Enqueue component assets.
	 *
	 * @param RequestInterface $request Request.
	 * @param Closure          $next Next.
	 * @return function
	 */
	public function handle( RequestInterface $request, Closure $next ) {
		$id = $request->query( 'invoice_id' );

		if ( $id ) {
			// Find the invoice and redirect to the checkout with checkout_id.
			$invoice = Invoice::find($id);

			if ( $invoice ) {
				return ( new RedirectResponse( $request ) )->to(
					add_query_arg(
						[
							'checkout_id' => $invoice->checkout_id,
						],
						\SureCart::getUrl()->checkout()
					)
				);
			}
		}

		return $next( $request );
	}
}

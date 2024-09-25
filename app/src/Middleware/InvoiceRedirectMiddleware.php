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

		// no checkout id, next request.
		if ( empty( $id ) ) {
			return $next( $request );
		}

		// Find the invoice and redirect to the invoice's checkout
		$invoice = Invoice::find($id);

		if ( ! $invoice ) {
			return $next( $request );
		}

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
}
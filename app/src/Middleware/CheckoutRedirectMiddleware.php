<?php

namespace SureCart\Middleware;

use Closure;
use SureCart\Models\Checkout;
use SureCartCore\Requests\RequestInterface;
use SureCartCore\Responses\RedirectResponse;

/**
 * Middleware for handling model archiving.
 */
class CheckoutRedirectMiddleware {
	/**
	 * Enqueue component assets.
	 *
	 * @param RequestInterface $request Request.
	 * @param Closure          $next Next.
	 * @return function
	 */
	public function handle( RequestInterface $request, Closure $next ) {
		$id = $request->query( 'checkout_id' );

		$checkout = Checkout::find( $id );

		if ( ! empty( $checkout->metadata->page_id ) ) {
			$url = get_permalink( (int) $checkout->metadata->page_id );
			if ( $url ) {
				return ( new RedirectResponse( $request ) )->to(
					esc_url_raw(
						add_query_arg(
							[
								'checkout_id' => $id,
							],
							$url
						)
					)
				);
			}
		}

		if ( ! empty( $checkout->metadata->page_url ) ) {
			return ( new RedirectResponse( $request ) )->to(
				esc_url_raw(
					add_query_arg(
						[
							'checkout_id' => $id,
						],
						$checkout->metadata->page_url
					)
				)
			);
		}

		if ( $id ) {
			return ( new RedirectResponse( $request ) )->to(
				add_query_arg(
					[
						'action' => 'show',
						'model'  => 'download',
						'id'     => $id,
					],
					\SureCart::pages()->url( 'dashboard' )
				)
			);
		}

		return $next( $request );
	}
}

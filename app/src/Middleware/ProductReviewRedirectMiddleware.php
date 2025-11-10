<?php

namespace SureCart\Middleware;

use Closure;
use SureCartCore\Requests\RequestInterface;
use SureCartCore\Responses\RedirectResponse;

/**
 * Middleware for product review.
 */
class ProductReviewRedirectMiddleware {
	/**
	 * Enqueue component assets.
	 *
	 * @param RequestInterface $request Request.
	 * @param Closure          $next Next.
	 *
	 * @return RedirectResponse|mixed
	 */
	public function handle( RequestInterface $request, Closure $next ) {
		$product_id = $request->query( 'product_id' );
		$context    = $request->query( 'context' );

		// If no product id or context, or context is not solicit reviews, continue.
		if ( empty( $product_id ) || empty( $context ) || 'customer.order.solicit_reviews' !== $context ) {
			return $next( $request );
		}

		$product = sc_get_product( $product_id );
		if ( empty( $product->post ) ) {
			return $next( $request );
		}

		// Get the product page URL with review form.
		$product_page_url = get_permalink( $product->post ) . '?product-review-form=' . $product->post->ID;

		// If not logged in, redirect to customer login with the target URL.
		if ( ! is_user_logged_in() ) {
			$login_url = add_query_arg(
				array(
					'redirect_to' => rawurlencode( $product_page_url ),
				),
				\SureCart::pages()->url( 'dashboard' )
			);
			return ( new RedirectResponse( $request ) )->to( esc_url_raw( $login_url ) );
		}

		// Redirect to the product page if user is logged in.
		if ( $product_page_url ) {
			return ( new RedirectResponse( $request ) )->to( esc_url_raw( $product_page_url ) );
		}

		return $next( $request );
	}
}

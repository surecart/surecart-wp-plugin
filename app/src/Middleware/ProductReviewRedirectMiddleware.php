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
		$product_id    = (int) $request->query( 'product_id' );
		$redirect_type = $request->query( 'type' );

		// need a path, a product id and type to be review.
		if ( empty( $product_id ) || empty( $redirect_type ) || 'review' !== $redirect_type ) {
			return $next( $request );
		}

		$product_page_url = get_permalink( $product_id ) . '?product-review-form=' . $product_id;

		// Redirect to the product page if it exists.
		if ( $product_page_url && is_user_logged_in() ) {
			return ( new RedirectResponse( $request ) )->to( $product_page_url );
		}

		return $next( $request );
	}
}

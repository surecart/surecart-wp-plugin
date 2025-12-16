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
		if ( ! $this->shouldHandleReviewRedirect( $request ) ) {
			return $next( $request );
		}

		$product = sc_get_product( $request->query( 'product_id' ) );
		if ( empty( $product->post ) ) {
			return $next( $request );
		}

		$product_page_url = $this->getProductReviewUrl( $product->post );

		// Only redirect if we have a valid product page URL.
		if ( empty( $product_page_url ) ) {
			return $next( $request );
		}

		return $this->redirectToReviewPage( $request, $product_page_url );
	}

	/**
	 * Check if request should be handled for review redirect.
	 *
	 * @param RequestInterface $request Request.
	 * @return bool
	 */
	private function shouldHandleReviewRedirect( RequestInterface $request ): bool {
		$product_id = $request->query( 'product_id' );
		$context    = $request->query( 'context' );

		return ! empty( $product_id )
			&& ! empty( $context )
			&& 'customer.order.solicit_reviews' === $context;
	}

	/**
	 * Get product review page URL.
	 *
	 * @param \WP_Post $post Product post.
	 * @return string|false
	 */
	private function getProductReviewUrl( $post ) {
		$permalink = get_permalink( $post );

		if ( ! $permalink ) {
			return false;
		}

		return add_query_arg(
			[ 'product-review-form' => $post->ID ],
			$permalink
		);
	}

	/**
	 * Redirect to review page, via login if needed.
	 *
	 * @param RequestInterface $request Request.
	 * @param string           $product_page_url Product page URL.
	 * @return RedirectResponse
	 */
	private function redirectToReviewPage( RequestInterface $request, string $product_page_url ): RedirectResponse {
		$redirect_url = $product_page_url;
		if ( ! is_user_logged_in() ) {
			$redirect_url = add_query_arg(
				[ 'redirect_to' => rawurlencode( $product_page_url ) ],
				\SureCart::pages()->url( 'dashboard' )
			);
		}

		return ( new RedirectResponse( $request ) )->to( esc_url_raw( $redirect_url ) );
	}
}

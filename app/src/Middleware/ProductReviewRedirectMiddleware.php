<?php

namespace SureCart\Middleware;

use Closure;
use SureCartCore\Requests\RequestInterface;
use SureCartCore\Responses\RedirectResponse;
use SureCartCore\Responses\ResponseService;

/**
 * Middleware to redirect users to product review pages from solicit review emails.
 */
class ProductReviewRedirectMiddleware {

	/**
	 * Response service.
	 *
	 * @var ResponseService
	 */
	protected $response_service = null;

	/**
	 * Constructor.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param ResponseService $response_service Response service.
	 */
	public function __construct( ResponseService $response_service ) {
		$this->response_service = $response_service;
	}

	/**
	 * Handle the request and redirect to review page if applicable.
	 *
	 * @param RequestInterface $request Request.
	 * @param Closure          $next Next.
	 *
	 * @return RedirectResponse|mixed
	 */
	public function handle( RequestInterface $request, Closure $next ) {
		if ( ! ( $this->shouldHandle( $request ) ) ) {
			return $next( $request );
		}

		// there's no product, next request.
		$product = sc_get_product( $request->query( 'product_id' ) );
		if ( empty( $product->post ) ) {
			return $next( $request );
		}

		// there's no product page url, next request.
		$product_page_url = $this->getProductReviewUrl( $product->post );
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
	private function shouldHandle( RequestInterface $request ): bool {
		return $request->query( 'product_id' )
			&& 'customer.order.solicit_reviews' === $request->query( 'context' );
	}

	/**
	 * Get product review page URL.
	 *
	 * @param \WP_Post $post Product post.
	 * @return string|false
	 */
	private function getProductReviewUrl( \WP_Post $post ) {
		$permalink = get_permalink( $post );

		return $permalink
			? add_query_arg( [ 'product-review-form' => $post->ID ], $permalink )
			: false;
	}

	/**
	 * Redirect to review page, via login if needed.
	 *
	 * @param RequestInterface $request Request.
	 * @param string           $product_page_url Product page URL.
	 * @return RedirectResponse
	 */
	private function redirectToReviewPage( RequestInterface $request, string $product_page_url ): RedirectResponse {
		$redirect_url = is_user_logged_in()
			? $product_page_url
			: add_query_arg(
				[ 'redirect_to' => rawurlencode( $product_page_url ) ],
				\SureCart::pages()->url( 'dashboard' )
			);

		return $this->response_service->redirect( $request )->to( esc_url_raw( $redirect_url ) );
	}
}

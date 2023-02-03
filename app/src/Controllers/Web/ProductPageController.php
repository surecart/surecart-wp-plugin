<?php
namespace SureCart\Controllers\Web;

use WP_Post;

/**
 * Handles webhooks
 */
class ProductPageController {
	/**
	 * Show the product page
	 *
	 * @param \SureCartCore\Requests\RequestInterface $request Request.
	 * @param \SureCartCore\View                      $view View.
	 * @param string                                  $id The id of the product.
	 * @return function
	 */
	public function show( $request, $view, $id ) {
		global  $sc_product, $_wp_current_template_content;

		// fetch the product by id/slug.
		$sc_product = \SureCart\Models\Product::with( [ 'prices' ] )->find( $id );
		if ( is_wp_error( $sc_product ) ) {
			return $this->handleError( $sc_product );
		}

		// if this product is a draft, check read permissions.
		if ( 'draft' === $sc_product->status && ! current_user_can( 'read_sc_products' ) ) {
			return $this->notFound();
		}

		// slug changed or we are using the id, redirect.
		if ( $sc_product->slug !== $id ) {
			return \SureCart::redirect()->to( esc_url_raw( \SureCart::routeUrl( 'product', [ 'id' => $sc_product->slug ] ) ) );
		}

		// set the current template for the block view.
		$_wp_current_template_content = $sc_product->template->content;

		// check to see if the product has a page or template.
		return \SureCart::view( 'web/product' );
	}

	/**
	 * Handle fetching error.
	 *
	 * @param \WP_Error $wp_error
	 *
	 * @return void
	 */
	public function handleError( \WP_Error $wp_error ) {
		$data = (array) $wp_error->get_error_data();
		if ( 404 === ( $data['status'] ?? null ) ) {
			return $this->notFound();
		}
		wp_die( esc_html( implode( ' ', $wp_error->get_error_messages() ) ) );
	}

	/**
	 * Handle not found error.
	 *
	 * @return void
	 */
	public function notFound() {
		global $wp_query;
		$wp_query->set_404();
		status_header( 404 );
		get_template_part( 404 );
		exit();
	}
}

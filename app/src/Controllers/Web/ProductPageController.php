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
	public function show() {
		global  $sc_product;

		// get the product from the query var.
		$id = get_query_var( 'sc_product_page_id' );

		// fetch the product by id/slug.
		$sc_product = \SureCart\Models\Product::with( [ 'prices', 'image' ] )->find( $id );

		if ( is_wp_error( $sc_product ) ) {
			return $this->handleError( $sc_product );
		}

		// if this product is a draft, check read permissions.
		if ( 'draft' === $sc_product->status && ! current_user_can( 'read_sc_products' ) ) {
			return $this->notFound();
		}

		// slug changed or we are using the id, redirect.
		if ( $sc_product->slug !== $id ) {
			return \SureCart::redirect()->to( $sc_product->permalink );
		}

		set_query_var( 'surecart_current_product', $sc_product );

		// check to see if the product has a page or template.
		return \SureCart::view(
			wp_is_block_theme() ? 'web/product-canvas' : 'web/product'
		)->with(
			[
				'content' => $sc_product->template->content ?? '',
			]
		);
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

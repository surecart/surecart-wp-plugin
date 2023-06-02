<?php
namespace SureCart\Controllers\Web;

/**
 * Handles webhooks
 */
class ProductPageController extends ProductTypePageController {
	/**
	 * Show the product page
	 *
	 * @param \SureCartCore\Requests\RequestInterface $request Request.
	 * @param \SureCartCore\View                      $view View.
	 * @param string                                  $id The id of the product.
	 * @return function
	 */
	public function show( $request, $view ) {
		// get the product from the query var.
		$id = get_query_var( 'sc_product_page_id' );

		// fetch the product by id/slug.
		$this->product = \SureCart\Models\Product::with( [ 'prices', 'image' ] )->find( $id );
		if ( is_wp_error( $this->product ) ) {
			return $this->handleError( $this->product );
		}

		// if this product is a draft, check read permissions.
		if ( 'draft' === $this->product->status && ! current_user_can( 'read_sc_products' ) ) {
			return $this->notFound();
		}

		// slug changed or we are using the id, redirect.
		if ( $this->product->slug !== $id ) {
			return \SureCart::redirect()->to( $this->product->permalink );
		}

		set_query_var( 'sc_product_page_id', $this->product->id );

		// add the filters.
		$this->filters();

		// handle block theme.
		if ( wp_is_block_theme() ) {
			global  $_wp_current_template_content;
			$_wp_current_template_content = $this->product->template->content ?? '';
		}

		// include the default view.
		include $view;

		return \SureCart::response();
	}
}

<?php
namespace SureCart\Controllers\Web;

use SureCart\Models\Form;

/**
 * Handles Product page requests for frontend.
 */
class ProductPageController extends BasePageController {
	/**
	 * Show the product page
	 *
	 * @param \SureCartCore\Requests\RequestInterface $request Request.
	 * @param \SureCartCore\View                      $view View.
	 *
	 * @return function|void
	 */
	public function show( $request, $view ) {
		// get the product from the query var.
		$id = get_query_var( 'sc_product_page_id' );

		// fetch the product by id/slug.
		$product = \SureCart\Models\Product::with( [ 'prices', 'image' ] )->find( $id );

		// Set the model to handle similar tasks.
		$this->setModel( $product );

		if ( is_wp_error( $product ) ) {
			return $this->handleError( $product );
		}

		// if this product is a draft, check read permissions.
		if ( 'draft' === $product->status && ! current_user_can( 'read_sc_products' ) ) {
			return $this->notFound();
		}

		// slug changed or we are using the id, redirect.
		if ( $product->slug !== $id ) {
			return \SureCart::redirect()->to( $product->permalink );
		}

		set_query_var( 'sc_product_page_id', $product->id );

		// add the filters.
		$this->filters();

		// handle block theme.
		if ( wp_is_block_theme() ) {
			global  $_wp_current_template_content;
			$_wp_current_template_content = $product->template->content ?? '';
		}

		// include the default view.
		include $view;

		return \SureCart::response();
	}

	/**
	 * Handle filters.
	 *
	 * @return void
	 */
	public function filters(): void {
		parent::filters();

		// Add edit product link to admin bar.
		add_action( 'admin_bar_menu', [ $this, 'addEditProductLink' ], 99 );

		// add data needed for product to load.
		add_filter(
			'surecart-components/scData',
			function( $data ) {
				$form = \SureCart::forms()->getDefault();

				$data['product_data'] = [
					'product'       => $this->model,
					'form'          => $form,
					'mode'          => Form::getMode( $form->ID ),
					'checkout_link' => \SureCart::pages()->url( 'checkout' ),
				];

				return $data;
			}
		);
	}

	/**
	 * Add edit product link.
	 *
	 * @param \WP_Admin_Bar $wp_admin_bar Admin bar.
	 *
	 * @return void
	 */
	public function addEditProductLink( $wp_admin_bar ): void {
		$wp_admin_bar->add_node(
			[
				'id'    => 'edit-product',
				'title' => __( 'Edit Product', 'surecart' ),
				'href'  => esc_url( \SureCart::getUrl()->edit( 'product', $this->model->id ) ),
			]
		);
	}
}

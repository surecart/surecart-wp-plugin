<?php

namespace SureCart\Controllers\Web;

use SureCart\Models\Form;

/**
 * Handles Upsell Page requests for frontend.
 */
class UpsellPageController extends BasePageController {
	/**
	 * The product model.
	 *
	 * @var \SureCart\Models\Product
	 */
	protected $product;

	/**
	 * Handle filters.
	 *
	 * @return void
	 */
	public function filters(): void {
		parent::filters();

		// Add edit product link to admin bar.
		add_action( 'admin_bar_menu', [ $this, 'addEditUpsellLink' ], 99 );

		// add data needed for product to load.
		add_filter(
			'surecart-components/scData',
			function( $data ) {
				$form = \SureCart::forms()->getDefault();

				$data['product_data'] = [
					'product'       => $this->product,
					'form'          => $form,
					'mode'          => Form::getMode( $form->ID ),
					'checkout_link' => \SureCart::pages()->url( 'checkout' ),
				];

				$data['upsell_data'] = [
					'upsell'   => $this->model,
				];

				return $data;
			}
		);
	}

	/**
	 * Add meta title and description.
	 *
	 * @return void
	 */
	public function addSeoMetaData(): void {
		// TODO: Add meta title and description.
	}

	/**
	 * Add edit links
	 *
	 * @param \WP_Admin_bar $wp_admin_bar The admin bar.
	 *
	 * @return void
	 */
	public function addEditUpsellLink( $wp_admin_bar ) {
		if ( empty( $this->model->id ) ) {
			return;
		}
		$wp_admin_bar->add_node(
			[
				'id'    => 'edit',
				'title' => __( 'Edit Upsell', 'surecart' ),
				'href'  => esc_url( \SureCart::getUrl()->edit( 'upsell', $this->model->id ) ),
			]
		);
	}

	/**
	 * Show the product page
	 *
	 * @param \SureCartCore\Requests\RequestInterface $request Request.
	 * @param \SureCartCore\View                      $view View.
	 * @param string                                  $id The id of the product.
	 * @return function
	 */
	public function show( $request, $view, $id ) {
		$id = get_query_var( 'sc_upsell_id' );
		// fetch the product by id/slug.
		$this->model = \SureCart\Models\Upsell::with( [ 'price' ] )->find( $id );

		if ( is_wp_error( $this->model ) ) {
			return $this->handleError( $this->model );
		}

		if ( empty( $this->model->price->product ) ) {
			return $this->notFound();
		}

		$this->product = \SureCart\Models\Product::with( [ 'prices', 'image', 'variants', 'variant_options' ] )->find( $this->model->price->product );

		// Stop if the product is not found.
		if ( empty( $this->product ) ) {
			return $this->notFound();
		}

		// Set the product page id.
		set_query_var( 'sc_product_page_id', $this->product->id );

		// Set the upsell id.
		set_query_var( 'sc_upsell_id', $this->model->id );

		// add the filters.
		$this->filters();

		// handle block theme.
		if ( wp_is_block_theme() ) {
			global $_wp_current_template_content;
			$_wp_current_template_content = $this->model->template->content ?? '';
		}

		// include the default view.
		include $view;

		return \SureCart::response();
	}
}

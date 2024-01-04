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
		$this->setInitialUpsellState( $request );

		// handle block theme.
		if ( wp_is_block_theme() ) {
			global $_wp_current_template_content;
			$_wp_current_template_content = $this->model->template->content ?? '';
		}

		// include the default view.
		include $view;

		return \SureCart::response();
	}

	/**
	 * Get the success url by form id.
	 *
	 * @param  int    $formId Checkout form id.
	 * @return string         The success url.
	 */
	public function getCheckoutSuccessUrl( int $formId ): string {
		$form = get_post( $formId );

		if ( is_wp_error( $form ) || empty( $form ) ) {
			return '';
		}

		$block = parse_blocks( $form->post_content )[0] ?? [];

		if ( empty( $block ) || empty( $block['attrs']['success_url'] ) ) {
			return '';
		}

		return $block['attrs']['success_url'];
	}

	/**
	 * Set initial upsell state.
	 *
	 * @param \SureCartCore\Requests\RequestInterface $request Request.
	 * @return void
	 */
	public function setInitialUpsellState( $request ): void {
		// Get checkout form id.
		$form_id = (int) $request->query( 'sc_form_id' ) ?? '';

		// Product state.
		$product_state[ $this->product->id ] = $this->product->getInitialPageState();

		// Set initial upsell state.
		sc_initial_state(
			[
				'product' => $product_state,
				'upsell' => [
					'product'     => $this->product,
					'upsell'      => $this->model,
					'checkout_id' => $request->query( 'sc_checkout_id' ) ?? '',
					'success_url' => $this->getCheckoutSuccessUrl( $form_id ),
				]
			]
		);
	}
}

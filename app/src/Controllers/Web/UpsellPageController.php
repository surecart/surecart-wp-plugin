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
	 * We don't wamt to index the upsell page.
	 *
	 * @return void
	 */
	public function addSeoMetaData(): void { ?>
		<meta name="robots" content="noindex" />
	<?php }

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

		// we need the checkout since it cannot be fetched through the upsell if it's expired.
		$checkout = \SureCart\Models\Checkout::with(['recommended_upsells', 'upsell.price'])->find( $request->query( 'sc_checkout_id' ) );

		// this is typically cached.
		$this->product = \SureCart\Models\Product::with( [ 'image', 'prices', 'product_medias', 'product_media.media', 'variants', 'variant_options' ] )->find( $this->model->price->product );

		// Stop if the product is not found.
		if ( empty( $this->product ) ) {
			return $this->notFound();
		}

		// Set the product page id.
		set_query_var( 'surecart_current_product', $this->product );

		// add the filters.
		$this->filters();

		// Set initial state.
		sc_initial_state(
			[
				'product' => [
					// we need to force the selected price.
					$this->product->id => $this->product->getInitialPageState([ 'selectedPrice' => $this->model->price ]),
				],
				'upsell'  => [
					'product'     => $this->product,
					'upsell'      => $this->model,
					'form_id'     => (int) $request->query( 'sc_form_id' ) ?? null,
					'checkout_id' => esc_attr( $request->query( 'sc_checkout_id' ) ?? null ),
					'checkout' 	  => $checkout,
					'text' 		  => $this->getCheckoutText( (int) $request->query( 'sc_form_id' ) ?? '' ),
					'success_url' => esc_url( $this->getCheckoutSuccessUrl( (int) $request->query( 'sc_form_id' ) ?? '' ) ),
				],
			]
		);

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
	 * Get the checkout success text.
	 *
	 * @return array
	 */
	public function getCheckoutText( int $form_id ) {
		$form = get_post( $form_id );

		if ( is_wp_error( $form ) || empty( $form ) ) {
			return '';
		}

		$block = wp_get_first_block( parse_blocks( $form->post_content), 'surecart/form' );
		$attributes = $block['attrs'] ?? [];

		return array_filter(
			[
				'success' => array_filter( $attributes['success_text'] ?? [] ),
			]
		);
	}

	/**
	 * Get the success url by form id.
	 *
	 * @param  int $form_id Checkout form id.
	 * @return string         The success url.
	 */
	public function getCheckoutSuccessUrl( int $form_id ): string {
		$form = get_post( $form_id );

		if ( is_wp_error( $form ) || empty( $form ) ) {
			return '';
		}

		$block = wp_get_first_block( parse_blocks( $form->post_content), 'surecart/form' );

		if ( empty( $block ) || empty( $block['attrs']['success_url'] ) ) {
			return '';
		}

		return $block['attrs']['success_url'];
	}
}

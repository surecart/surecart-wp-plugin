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
		$this->model = \SureCart\Models\Product::with( [ 'prices', 'image', 'variants', 'variant_options' ] )->find( $id );

		if ( is_wp_error( $this->model ) ) {
			return $this->handleError( $this->model );
		}

		// if this product is a draft, check read permissions.
		if ( 'draft' === $this->model->status && ! current_user_can( 'read_sc_products' ) ) {
			return $this->notFound();
		}

		// slug changed or we are using the id, redirect.
		if ( $this->model->slug !== $id ) {
			return \SureCart::redirect()->to( $this->model->permalink );
		}

		set_query_var( 'sc_product_page_id', $this->model->id );

		// add the filters.
		$this->filters();
		$this->setInitialProductState();

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
	 * Handle filters.
	 *
	 * @return void
	 */
	public function filters(): void {
		parent::filters();

		// Add edit product link to admin bar.
		add_action( 'admin_bar_menu', [ $this, 'addEditProductLink' ], 99 );
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


	/**
	 * Get selected variant
	 *
	 * @param array $variants
	 *
	 * @return object|null
	 */
	private function getSelectedVariant() {
		$variants = $this->model->variants->data ?? [];
		if ( empty( $variants ) ) {
			return null;
		}

		if ( ! $this->model->stock_enabled || $this->model->allow_out_of_stock_purchases ) {
			return $variants[0];
		}

		foreach ( $variants as $variant ) {
			if ( $variant['stock'] > 0 ) {
				return $variant;
			}
		}

		return null;
	}

	/**
	 * Set initial product state
	 *
	 * @return void
	 */
	public function setInitialProductState() {
		$form             = \SureCart::forms()->getDefault();
		$selected_price   = ( $this->model->activePrices() ?? [] )[0] ?? null;
		$add_hoc_amount   = $selected_price['add_hoc_amount'] ?? null;
		$variant_options  = $this->model->variant_options->data ?? [];
		$selected_variant = $this->getSelectedVariant();

		$product_state[ $this->model->id ] = array(
			'formId'          => $form->ID,
			'mode'            => Form::getMode( $form->ID ),
			'product'         => $this->model,
			'prices'          => $this->model->prices->data ?? [],
			'quantity'        => 1,
			'selectedPrice'   => $selected_price,
			'total'           => null,
			'dialog'          => null,
			'busy'            => false,
			'disabled'        => $selected_price['archived'] ?? false,
			'addHocAmount'    => $add_hoc_amount,
			'error'           => null,
			'checkoutUrl'     => '',
			'line_item'       => array(
				'price_id' => $selected_price['id'] ?? null,
				'quantity' => 1,
			),
			'variant_options' => $variant_options,
			'variants'        => $this->model->variants->data ?? [],
			'selectedVariant' => $selected_variant,
			'isProductPage'   => true,
			'variantValues'   => [
				'option_1' => $selected_variant['option_1'] ?? null,
				'option_2' => $selected_variant['option_2'] ?? null,
				'option_3' => $selected_variant['option_3'] ?? null,
			],
		);

		if ( $selected_price->ad_hoc ) {
			$product_state[ $this->model->id ]['line_item']['ad_hoc_amount'] = $add_hoc_amount;
		}

		$product_state[ $this->model->id ]['variantValues'] = array_filter(
			$product_state[ $this->model->id ]['variantValues'],
			function( $value ) {
				return ! empty( $value );
			}
		);

		sc_initial_state(
			[
				'product' => $product_state,
			]
		);
	}
}

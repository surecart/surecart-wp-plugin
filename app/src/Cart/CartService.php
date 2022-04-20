<?php

namespace SureCart\Cart;

class CartService {
	/**
	 * Bootstrap the cart.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_action( 'wp_head', [ $this, 'addComponentData' ] );
		add_action( 'wp_footer', [ $this, 'renderCartComponent' ] );
	}

	public function addComponentData() {
		\SureCart::assets()->addComponentData(
			'sc-cart',
			'#sc-cart',
			[
				'cartTitle'    => esc_html__( 'My Cart', 'surecart' ),
				'cartTemplate' => $this->cartTemplate(),
				'checkoutUrl'  => \SureCart::pages()->url( 'checkout' ),
				'formId'       => 'sc-checkout-' . \SureCart::forms()->getDefaultId(),
			]
		);
	}

	/**
	 * The template for the cart.
	 *
	 * @return string
	 */
	public function cartTemplate() {
		ob_start(); ?>
			<sc-order-summary>
				<sc-line-items></sc-line-items>
			</sc-order-summary>
		<?php
		return apply_filters( 'surecart/templates/cart', ob_get_clean() );
	}

	/**
	 * Render the cart components.
	 *
	 * @return void
	 */
	public function renderCartComponent() {
		if ( $this->pageHasForm() ) {
			return '';
		}
		// This dynamically adds prop data to a component since we cannot pass objects data as a prop.
		echo '<sc-cart id="sc-cart"></sc-cart>';
	}

	/**
	 * Does the current page have a form?
	 *
	 * @return void
	 */
	public function pageHasForm() {
		global $post;

	}
}

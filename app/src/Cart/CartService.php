<?php

namespace SureCart\Cart;

/**
 * The cart service.
 */
class CartService {
	/**
	 * Bootstrap the cart.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_action(
			'wp_enqueue_scripts',
			function() {
				$this->addComponentData();
				\SureCart::assets()->enqueueComponents();
			}
		);
		add_action( 'wp_footer', [ $this, 'renderCartComponent' ] );
	}

	/**
	 * Add cart component data.
	 *
	 * @return void
	 */
	public function addComponentData() {
		\SureCart::assets()->addComponentData(
			'sc-cart',
			'#sc-cart',
			[
				'cartTitle'    => esc_html__( 'My Cart', 'surecart' ),
				'cartTemplate' => $this->cartTemplate(),
				'checkoutUrl'  => \SureCart::pages()->url( 'checkout' ),
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
		// This dynamically adds prop data to a component since we cannot pass objects data as a prop.
		echo '<sc-cart id="sc-cart" always-show form-id="' . \SureCart::forms()->getDefaultId() . '"></sc-cart>';
	}
}

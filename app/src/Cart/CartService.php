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
				<sc-line-items removable editable></sc-line-items>
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
		ob_start();
		?>
		<sc-cart id="sc-cart" always-show form-id="<?php echo esc_attr( \SureCart::forms()->getDefaultId() ); ?>" style="font-size: 16px">
			<sc-line-items removable editable></sc-line-items>
			<sc-total></sc-total>
			<sc-button type="primary" full>
				<?php esc_html_e( 'Checkout!', 'surecart' ); ?>
			</sc-button>
		</sc-cart>
		<?php
		echo wp_kses_post( ob_get_clean() );
	}
}

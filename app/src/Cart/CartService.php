<?php

namespace SureCart\Cart;

use SureCart\Models\Form;

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
		// Slide-out is disabled. Do not load scripts.
		if ( (bool) get_option( 'sc_slide_out_cart_disabled', false ) ) {
			return;
		}

		// enqueue scripts needed for slide out cart.
		add_action(
			'wp_enqueue_scripts',
			function() {
				\SureCart::assets()->enqueueComponents();
			}
		);
		add_action( 'wp_footer', [ $this, 'renderCartComponent' ] );
	}

	/**
	 * Get the cart template.
	 *
	 * @return string
	 */
	public function cartTemplate() {
		ob_start();
		$form = $this->getForm();
		if ( empty( $form->ID ) ) {
			return '';
		}
		$cart = \SureCart::cartPost()->get();
		if ( empty( $cart->post_content ) ) {
			return '';
		}
		?>

		<sc-cart
			id="sc-cart"
			header="<?php esc_attr_e( 'Cart', 'surecart' ); ?>"
			form-id="<?php echo esc_attr( $form->ID ); ?>"
			mode="<?php echo esc_attr( Form::getMode( $form->ID ) ); ?>"
			checkout-link="<?php echo esc_attr( \SureCart::pages()->url( 'checkout' ) ); ?>"
			style="font-size: 16px">

			<?php echo wp_kses_post( do_blocks( $cart->post_content ) ); ?>

		</sc-cart>
		<?php
		return trim( preg_replace( '/\s+/', ' ', ob_get_clean() ) );
	}

	/**
	 * Render the cart components.
	 *
	 * @return void
	 */
	public function renderCartComponent() {
		$form = $this->getForm();
		if ( empty( $form->ID ) ) {
			return;
		}
		$template = $this->cartTemplate();
		?>
		<sc-cart-loader
			form-id="<?php echo esc_attr( $form->ID ); ?>"
			mode="<?php echo esc_attr( Form::getMode( $form->ID ) ); ?>"
			template='<?php echo esc_attr( $template ); ?>'>
		</sc-cart-loader>
		<?php
	}

	/**
	 * Get the form
	 *
	 * @return \WP_Post The default form post.
	 */
	public function getForm() {
		return \SureCart::forms()->getDefault();
	}
}

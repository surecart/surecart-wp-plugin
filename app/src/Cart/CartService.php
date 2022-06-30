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
				\SureCart::assets()->enqueueComponents();
			}
		);
		add_action( 'wp_footer', [ $this, 'renderCartComponent' ] );
	}

	public function cartTemplate() {
		ob_start();
		?>
		<sc-cart id="sc-cart" header="<?php esc_attr_e( 'Cart', 'surecart' ); ?>" form-id="<?php echo esc_attr( \SureCart::forms()->getDefaultId() ); ?>" style="font-size: 16px">

			<!--
			<div slot="cart-header" style="position: relative;">
				<sc-text style="--font-size: var(--sc-font-size-x-small);">We pay for shipping on all orders!</sc-text>
			</div>
			-->


			<sc-line-items removable editable></sc-line-items>

			<!-- <div slot="cart-footer" style="position: relative;">
				<sc-text style="--font-size: var(--sc-font-size-x-small);">Add at least $82.00 more to get free shipping!</sc-text>
				<div style="position: absolute; top: 0; left: 0; right: 0; background: var(--sc-color-gray-300);">
					<div style="width: 50%; height: 3px; background: var(--sc-color-primary-500);"></div>
				</div>
			</div> -->

			<sc-order-coupon-form label="<?php esc_attr_e( 'Add Coupon Code', 'surecart' ); ?>" slot="cart-footer">
				<?php esc_html_e( 'Apply Coupon', 'surecart' ); ?>
			</sc-order-coupon-form>

			<sc-spacing slot="cart-footer" style="--spacing: var(--sc-spacing-small)">
				<sc-line-item-total>
					<span slot="title"><?php esc_html_e( 'Subtotal', 'surecart' ); ?></span>
				</sc-line-item-total>
			</sc-spacing>

			<sc-button slot="cart-footer" class="sc-no-border" type="primary" href="<?php echo esc_url_raw( \SureCart::pages()->url( 'checkout' ) ); ?>" full>
				<?php esc_html_e( 'Checkout', 'surecart' ); ?>
			</sc-button>

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
		?>
		<sc-cart-loader form-id="<?php echo esc_attr( \SureCart::forms()->getDefaultId() ); ?>" template='<?php echo esc_attr( $this->cartTemplate() ); ?>'></sc-cart-loader>
		<?php
	}
}

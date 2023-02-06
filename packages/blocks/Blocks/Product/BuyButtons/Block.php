<?php

namespace SureCartBlocks\Blocks\Product\BuyButtons;

use SureCart\Models\Form;
use SureCartBlocks\Blocks\BaseBlock;

/**
 * Product Title Block
 */
class Block extends BaseBlock {
	/**
	 * Keep track of the instance number of this block.
	 *
	 * @var integer
	 */
	public static $instance;

	/**
	 * Render the block
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content Post content.
	 *
	 * @return string
	 */
	public function render( $attributes, $content ) {
		// need a form for checkout.
		$form = \SureCart::forms()->getDefault();
		if ( empty( $form->ID ) ) {
			return current_user_can( 'edit_products' ) ? '<sc-alert type="warning" open>' . esc_html__( 'Your default store checkout form has been deleted. Please deactivate and reactivate the plugin to regenerate this form.', 'surecart' ) . '</sc-alert>' : '';
		}

		// need a page to checkout.
		$checkout_link = \SureCart::pages()->url( 'checkout' );
		if ( empty( $checkout_link ) ) {
			return current_user_can( 'edit_products' ) ? '<sc-alert type="warning" open>' . esc_html__( 'Your default store checkout page has been deleted. Please deactivate and reactivate the plugin to regenerate this page.', 'surecart' ) . '</sc-alert>' : '';
		}

		ob_start(); ?>

		<sc-product-buy-buttons
			form-id="<?php echo esc_attr( $form->ID ); ?>"
			mode="<?php echo esc_attr( Form::getMode( $form->ID ) ); ?>"
			checkout-url="<?php echo esc_url( $checkout_link ); ?>">

			<sc-button data-action="add-to-cart" full class="<?php echo esc_attr( $this->getClasses( $attributes, 'surecart-block' ) ); ?>"
				style="<?php echo esc_attr( $this->getStyles( $attributes ) ); ?>">
				<?php echo wp_kses_post( $attributes['text'] ); ?>
			</sc-button>

			<sc-button data-action="buy" full type="primary" class="<?php echo esc_attr( $this->getClasses( $attributes, 'surecart-block' ) ); ?>"
				style="<?php echo esc_attr( $this->getStyles( $attributes ) ); ?>">
				<?php esc_html_e( 'Buy Now', 'surecart' ); ?>
			</sc-button>
		</sc-product-buy-buttons>

		<?php
		return ob_get_clean();
	}
}

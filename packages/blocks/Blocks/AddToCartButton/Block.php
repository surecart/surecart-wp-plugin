<?php

namespace SureCartBlocks\Blocks\AddToCartButton;

use SureCart\Models\Component;
use SureCart\Models\Form;
use SureCartBlocks\Blocks\BaseBlock;
/**
 * Logout Button Block.
 */
class Block extends BaseBlock {
	/**
	 * Render the block
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content Post content.
	 *
	 * @return string
	 */
	public function render( $attributes, $content ) {
		// need a price id.
		if ( empty( $attributes['price_id'] ) ) {
			return '';
		}

		// need a form for checkout.
		$form = \SureCart::forms()->getDefault();
		if ( empty( $form->ID ) ) {
			return '';
		}
		ob_start(); ?>
		<sc-cart-form
			price-id="<?php echo esc_attr( $attributes['price_id'] ); ?>"
			form-id="<?php echo esc_attr( $form->ID ); ?>"
			mode="<?php echo esc_attr( Form::getMode( $form->ID ) ); ?>">
		</sc-cart-form>
		<?php
		return wp_kses_post( ob_get_clean() );
	}
}

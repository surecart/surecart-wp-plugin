<?php

namespace SureCartBlocks\Blocks\CartMenuButton;

use SureCartBlocks\Blocks\BaseBlock;

/**
 * Cart Menu Button CTA Block.
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
	public function render( $attributes, $content = '' ) {
		$form = \SureCart::cart()->getForm();
		$mode = \SureCart::cart()->getMode();

		// Stop if no form or mode found as for deletion.
		if ( empty( $form->ID ) || empty( $mode ) ) {
			return '';
		}

		// Don't render if the cart is disabled.
		if ( ! \SureCart::cart()->isCartEnabled() ) {
			return '';
		}

		ob_start(); ?>

		<a href="<?php echo esc_attr( \SureCart::pages()->url( 'checkout' ) ); ?>" class="menu-link <?php echo esc_attr( $this->getClasses( $attributes ) ); ?>" style="<?php echo esc_attr( $this->getStyles( $attributes ) ); ?> line-height: 0;">
			<sc-cart-button
				cart-menu-always-shown='<?php echo esc_attr( $attributes['cartMenuAlwaysShown'] ? 'true' : 'false' ); ?>'
				form-id='<?php echo esc_attr( $form->ID ); ?>'
				mode='<?php echo esc_attr( $mode ); ?>'>
				<sc-icon name='<?php echo esc_attr( $attributes['cartIcon'] ); ?>'></sc-icon>
			</sc-cart-button>
		</a>

		<?php
		return ob_get_clean();
	}
}

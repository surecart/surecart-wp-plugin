<?php

namespace SureCartBlocks\Blocks\CartHeader;

use SureCartBlocks\Blocks\BaseBlock;

/**
 * Cart CTA Block.
 */
class Block extends BaseBlock {
	/**
	 * Render the block
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content Post content.
	 * @param object $block Block object.
	 *
	 * @return string
	 */
	public function render( $attributes, $content, $block = null ) {
		ob_start(); ?>

		<div  slot="<?php echo esc_attr( 'cart-' . ( $attributes['slot'] ?? 'header' ) ); ?>">
			<sc-cart-header>
				<?php echo wp_kses_post( $attributes['text'] ?? '' ); ?>
			</sc-cart-header>
		</div>

		<?php
		return ob_get_clean();
	}
}

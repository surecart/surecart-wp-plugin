<?php

namespace SureCartBlocks\Blocks\Product\Quantity;

use SureCartBlocks\Blocks\BaseBlock;

/**
 * Product Title Block
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
		ob_start(); ?>

		<sc-product-quantity
			label="<?php echo esc_attr( $attributes['label'] ?? '' ); ?>"
			class="<?php echo esc_attr( $this->getClasses( $attributes, 'surecart-block' ) ); ?>"
			style="<?php echo esc_attr( $this->getStyles( $attributes ) ); ?>">
		</sc-product-quantity>

		<?php
		return ob_get_clean();
	}
}

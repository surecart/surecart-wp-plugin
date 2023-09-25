<?php

namespace SureCartBlocks\Blocks\Product\Quantity;

use SureCartBlocks\Blocks\ProductBlock;

/**
 * Product Title Block
 */
class Block extends ProductBlock {
	/**
	 * Render the block
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content Post content.
	 *
	 * @return string
	 */
	public function render( $attributes, $content ) {
		$product_id = $this->getProductId( $attributes );
		ob_start(); ?>

		<sc-product-quantity
			label="<?php echo esc_attr( $attributes['label'] ?? '' ); ?>"
			product-id="<?php echo esc_attr( $product_id ); ?>"
			class="<?php echo esc_attr( $this->getClasses( $attributes, 'surecart-block' ) ); ?>"
			style="<?php echo esc_attr( $this->getStyles( $attributes ) ); ?>">
		</sc-product-quantity>

		<?php
		return ob_get_clean();
	}
}

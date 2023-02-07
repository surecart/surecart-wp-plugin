<?php

namespace SureCartBlocks\Blocks\Product\Title;

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
		global $sc_product;
		// no product found.
		if ( ! $sc_product ) {
			return false;
		}

		return sprintf(
			'<%1$s class="%2$s" style="%3$s">
				<sc-product-text text="name">%4$s</sc-product-text>
			</%1$s>',
			'h' . (int) ( $attributes['level'] ?? 1 ),
			esc_attr( $this->getClasses( $attributes, 'surecart-block product-title' ) ),
			esc_attr( $this->getStyles( $attributes ) ),
			$sc_product->name
		);
	}
}

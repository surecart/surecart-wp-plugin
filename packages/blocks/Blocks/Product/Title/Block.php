<?php

namespace SureCartBlocks\Blocks\Product\Title;

use SureCartBlocks\Blocks\BaseBlock;
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
		$product = $this->getProduct( $attributes );
		if ( empty( $product ) ) {
			return '';
		}

		return sprintf(
			'<%1$s class="%2$s" style="%3$s">
				%4$s
			</%1$s>',
			'h' . (int) ( $attributes['level'] ?? 1 ),
			esc_attr( $this->getClasses( $attributes ) . ' surecart-block product-title' ),
			esc_attr( $this->getStyles( $attributes ) ),
			wp_kses_post( $product->name ?? '' )
		);
	}
}

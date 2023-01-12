<?php

namespace SureCartBlocks\Blocks\ProductTitle;

use SureCartBlocks\Blocks\BaseBlock;
use SureCartBlocks\Util\BlockStyleAttributes;

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
		$product = get_post_meta( get_the_ID(), 'product' );
		// no product found.
		if ( ! $product ) {
			return false;
		}

		// get block classes and styles.
		['classes' => $classes, 'styles' => $styles] = BlockStyleAttributes::getClassesAndStylesFromAttributes( $attributes );
		// get text align class.
		['class' => $text_align_class] = BlockStyleAttributes::getTextAlignClassAndStyle( $attributes );

		return sprintf(
			'<%1$s class="surecart-block %2$s %3$s" style="%4$s">
				%5$s
			</%1$s>',
			'h' . (int) ( $attributes['level'] ?? 1 ),
			esc_attr( $text_align_class ?? '' ),
			esc_attr( $classes ?? '' ),
			esc_attr( $styles ?? '' ),
			$product->name
		);
	}
}

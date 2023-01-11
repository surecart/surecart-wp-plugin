<?php

namespace SureCartBlocks\Blocks\ProductTitle;

use SureCartBlocks\Blocks\BaseBlock;

/**
 * Checkout block
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
		var_dump( $attributes );
		$tagname = 'h' . $attributes['level'] ?? 1;

		return "<$tagname class='" . esc_attr( $attributes['className'] ) . "'>"
			. $product->name .
			" </$tagname>";
	}
}

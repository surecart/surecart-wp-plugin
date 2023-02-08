<?php

namespace SureCartBlocks\Blocks\ProductListImage;

use SureCartBlocks\Blocks\BaseBlock;

/**
 * ProductList block
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
		
        <sc-product-image
			alt=""
			src="<?php echo esc_attr( $attributes["src"] ); ?>"
			sizing="<?php echo esc_attr( $attributes["sizing"] ); ?>"
		></sc-product-image>

		<?php
		return ob_get_clean();
	}
}

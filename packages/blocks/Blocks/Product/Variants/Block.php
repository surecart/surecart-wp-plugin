<?php

namespace SureCartBlocks\Blocks\Product\Variants;

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
		ob_start();
		?>
		<sc-product-variation-choices/>
		</sc-product-variation-choices>
		<?php
		return ob_get_clean();
	}
}

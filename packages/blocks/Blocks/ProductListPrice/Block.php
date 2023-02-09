<?php

namespace SureCartBlocks\Blocks\ProductListPrice;

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
		
        <div>
			<div>
				<strong>$545</strong>
				<span>$656</span>
			</div>
		</div>

		<?php
		return ob_get_clean();
	}
}

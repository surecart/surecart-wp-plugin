<?php

namespace SureCartBlocks\Blocks\ProductListTitle;

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
            <?php echo esc_html( $attributes['title'] ); ?>
		</div>

		<?php
		return ob_get_clean();
	}
}

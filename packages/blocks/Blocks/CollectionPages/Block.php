<?php

namespace SureCartBlocks\Blocks\CollectionPages;

use SureCartBlocks\Blocks\BaseBlock;

/**
 * Collection Pages Block.
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
	public function render( $attributes, $content = '' ) {
		ob_start(); ?>

		Collection Pages Block

		<?php
		return ob_get_clean();
	}
}

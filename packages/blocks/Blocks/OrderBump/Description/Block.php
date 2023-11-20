<?php

namespace SureCartBlocks\Blocks\OrderBump\Description;

use SureCartBlocks\Blocks\BaseBlock;

/**
 * Order Bump Description Block
 */
class Block extends BaseBlock {
	/**
	 * Keep track of the instance number of this block.
	 *
	 * @var integer
	 */
	public static $instance;

	/**
	 * Render the block
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content Post content.
	 *
	 * @return string
	 */
	public function render( $attributes, $content ) {
		return "Order bump description";
	}
}

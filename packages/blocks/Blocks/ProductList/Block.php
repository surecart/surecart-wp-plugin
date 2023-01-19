<?php

namespace SureCartBlocks\Blocks\ProductList;

use SureCartBlocks\Blocks\BaseBlock;
use SureCart\Models\Product;
use SureCartBlocks\Controllers\ProductsController;

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
		return ( new ProductsController() )->index( $attributes );
	}
}

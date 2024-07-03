<?php

namespace SureCartBlocks\Blocks\Product\PriceChoices;

use SureCartBlocks\Blocks\Product\ProductBlock;

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
		return \SureCart::block()
			->productPriceChoicesMigration( $attributes, $this->block )
			->render();
	}
}

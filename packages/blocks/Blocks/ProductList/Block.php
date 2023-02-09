<?php

namespace SureCartBlocks\Blocks\ProductList;

use SureCartBlocks\Blocks\BaseBlock;
use SureCart\Models\Product;
use SureCartBlocks\Blocks\ProductListItem\Block as ProductListItemBlock;

/**
 * ProductList block
 */
class Block extends BaseBlock {
	/**
	 * Get the style for the block
	 *
	 * @param  array $attributes Block attributes.
	 * @return string
	 */
	public function getProductsData( ) {
		return Product::where( [ 'archived' => false, ])->with( [ 'prices' ] )->get();
	}
	
	/**
	 * Render the block
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content Post content.
	 *
	 * @return string
	 */
	public function render( $attributes, $content ) {
		// print_r( $attributes );
		$products = $this->getProductsData();

		ob_start(); ?>
		<div style="display: grid; gap: 1rem; grid-template-columns: repeat(4, 1fr);">
			<?php foreach($products as $item): ?>
				<div style="border: 1px solid;">
					<?php $attributes = array_merge($this->block->inner_blocks[0]->parsed_block['attrs']); ?>
					<!-- <?php var_dump($attributes) ?> -->
					<?php var_dump($this->block->inner_blocks[0]) ?>
				</div>
			<?php endforeach; ?>
		</div>
		<?php
		return ob_get_clean();
	}
}

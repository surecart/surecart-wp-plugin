<?php

namespace SureCartBlocks\Blocks\ProductList;

use SureCartBlocks\Blocks\BaseBlock;
use SureCart\Models\Product;
use SureCartBlocks\Blocks\ProductListTitle\Block as ProductListTitleBlock;
use SureCartBlocks\Blocks\ProductListImage\Block as ProductListImageBlock;

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
				<div>
					<!-- <?php var_dump($item) ?> -->
					<?php foreach($this->block->inner_blocks as $block) : ?>

						<?php if ( $block->name === 'surecart/product-list-title'): ?>
							<?php $attributes = array_merge($block->parsed_block['attrs'], ['title' => $item->name]); ?>
							<?php echo (new ProductListTitleBlock())->render($attributes, ''); ?>
						<?php endif; ?>

						<?php if ( $block->name === 'surecart/product-list-image'): ?>
							<?php $attributes = array_merge($block->parsed_block['attrs'], ['src' => $item->image_url]); ?>
							<?php echo (new ProductListImageBlock())->render($attributes, ''); ?>
						<?php endif; ?>

					<?php endforeach; ?>
				</div>
			<?php endforeach; ?>
		</div>
		<?php
		return ob_get_clean();
	}
}

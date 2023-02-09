<?php

namespace SureCartBlocks\Blocks\ProductListItem;

use SureCartBlocks\Blocks\BaseBlock;
use SureCartBlocks\Blocks\ProductListTitle\Block as ProductListTitleBlock;
use SureCartBlocks\Blocks\ProductListImage\Block as ProductListImageBlock;

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
	public function render( $attributes, $product ) {

		ob_start(); ?>
			<div>
				<?php var_dump($product) ?>
				<!-- <?php var_dump($attributes) ?> -->
				<?php foreach($this->block->inner_blocks as $block) : ?>

					<?php if ( $block->name === 'surecart/product-list-title'): ?>
						<?php $attributes = array_merge($block->parsed_block['attrs'], ['title' => $product->name]); ?>
						<?php echo (new ProductListTitleBlock())->render($attributes, ''); ?>
					<?php endif; ?>

					<?php if ( $block->name === 'surecart/product-list-image'): ?>
						<?php $attributes = array_merge($block->parsed_block['attrs'], ['src' => $product->image_url]); ?>
						<?php echo (new ProductListImageBlock())->render($attributes, ''); ?>
					<?php endif; ?>

				<?php endforeach; ?>
			</div>
		<?php
		return ob_get_clean();
	}
}

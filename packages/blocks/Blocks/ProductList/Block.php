<?php

namespace SureCartBlocks\Blocks\ProductList;

use SureCartBlocks\Blocks\BaseBlock;
use SureCart\Models\Product;

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
		$products = $this->getProductsData();

		ob_start(); ?>
		<div style="display: grid; gap: 1rem; grid-template-columns: repeat(4, 1fr);">
			<?php foreach($products as $item): ?>
				<div>
					<?php echo filter_block_content( $content, 'post' ); ?>
				</div>
			<?php endforeach; ?>
		</div>
		<?php
		return ob_get_clean();
	}
}

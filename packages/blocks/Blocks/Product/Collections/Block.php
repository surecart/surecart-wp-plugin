<?php

namespace SureCartBlocks\Blocks\Product\Collections;

use SureCart\Models\ProductCollection;
use SureCartBlocks\Blocks\BaseBlock;
use SureCartBlocks\Util\BlockStyleAttributes;

/**
 * Product Collection Block
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
		$product                                     = get_query_var( 'surecart_current_product' );
		['styles' => $styles, 'classes' => $classes] = BlockStyleAttributes::getClassesAndStylesFromAttributes( $attributes );

		if ( empty( $product ) ) {
			return '';
		}

		$max_collection_count = (int) $attributes['collectionCount'];
		$collections          = ProductCollection::where(
			[
				'product_ids' => [ $product->id ],
			]
		)->get();

		$collections = array_splice( $collections, 0, $max_collection_count );

		ob_start(); ?>
			<sc-flex justify-content="flex-start" flex-wrap="wrap">
				<?php foreach ( $collections as $collection ) : ?>
					<span
					class="sc-product-collection-badge <?php echo esc_attr( $classes ); ?>"
					style="<?php echo esc_attr( $styles ); ?>"
					>
					<?php echo $collection->name; ?></span>
				<?php endforeach; ?>
			</sc-flex>
		<?php
		return ob_get_clean();
	}
}

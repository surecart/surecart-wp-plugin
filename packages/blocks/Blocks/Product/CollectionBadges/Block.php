<?php

namespace SureCartBlocks\Blocks\Product\CollectionBadges;

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
		$product_collections  = ProductCollection::where(
			[
				'product_ids' => [ $product->id ],
			]
		)->get();

		$product_collections = array_splice( $product_collections, 0, $max_collection_count );

		ob_start(); ?>
			<sc-flex justify-content="flex-start" flex-wrap="wrap">
				<?php foreach ( $product_collections as $product_collection ) : ?>
					<a href="<?php echo esc_attr( $product_collection->permalink ); ?>"
						class="sc-product-collection-badge <?php echo esc_url( $classes ); ?>"
						style="<?php echo esc_attr( $styles ); ?>"
					>
						<?php echo esc_html( $product_collection->name ); ?>
					</a>
				<?php endforeach; ?>
			</sc-flex>
		<?php
		return ob_get_clean();
	}
}

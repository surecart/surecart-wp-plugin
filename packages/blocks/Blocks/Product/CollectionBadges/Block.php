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
		$product = get_query_var( 'surecart_current_product' );
		if ( empty( $product ) ) {
			return '';
		}

		// get the collections expanded on the product.
		$collections = $product->product_collections->data ?? [];

		// we don't have the collections.
		if ( empty( $collections ) ) {
			return '';
		}

		['styles' => $styles, 'classes' => $classes] = BlockStyleAttributes::getClassesAndStylesFromAttributes( $attributes );

		ob_start(); ?>
			<sc-flex justify-content="flex-start" flex-wrap="wrap">
				<?php foreach ( $collections as $collection ) : ?>
					<a
					href="<?php echo esc_url( $collection->permalink ); ?>"
					class="sc-product-collection-badge <?php echo esc_attr( $classes ); ?>"
					style="<?php echo esc_attr( $styles ); ?>"
					>
					<?php echo wp_kses_post( $collection->name ); ?></a>
				<?php endforeach; ?>
			</sc-flex>
		<?php
		return ob_get_clean();
	}
}

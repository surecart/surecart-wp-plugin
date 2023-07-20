<?php

namespace SureCartBlocks\Blocks\Product\Collections;

use SureCartBlocks\Blocks\BaseBlock;

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
		ob_start(); ?>
			<sc-product-collections
				size="<?php echo esc_attr( $attributes['size'] ?? '' ); ?>"
				type="<?php echo esc_attr( $attributes['type'] ?? '' ); ?>"
				pill="<?php echo esc_attr( $attributes['pill'] ?? '' ); ?>"
				collection-count="<?php echo esc_attr( $attributes['collectionCount'] ?? '' ); ?>"
			></sc-product-collections>
		<?php
		return ob_get_clean();
	}
}

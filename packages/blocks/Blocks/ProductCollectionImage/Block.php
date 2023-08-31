<?php

namespace SureCartBlocks\Blocks\ProductCollectionImage;

use SureCartBlocks\Blocks\BaseBlock;

/**
 * Product Collection Image Block
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
		$collection = get_query_var( 'surecart_current_collection' );
		if ( empty( $collection ) || empty( $collection->image ) ) {
			return '';
		}

		return sprintf(
			'<img class="%1$s" style="%2$s" src="%3$s" />',
			esc_attr( $this->getClasses( $attributes ) . ' surecart-block collection-image' ),
			esc_attr( $this->getStyles( $attributes ) ),
			$collection->image->url ?? ''
		);
	}
}

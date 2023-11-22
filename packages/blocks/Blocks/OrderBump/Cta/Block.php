<?php

namespace SureCartBlocks\Blocks\OrderBump\Cta;

use SureCartBlocks\Blocks\BaseBlock;

/**
 * Product Title Block
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
		$bump = get_query_var( 'surecart_current_bump' );

		// If there is no bump call to action, return empty string.
		if ( empty( $bump->metadata->cta ?? '' ) ) {
			return '';
		}

		return sprintf(
			'<%1$s class="%2$s" style="%3$s">
				%4$s
			</%1$s>',
			'h' . (int) ( $attributes['level'] ?? 1 ),
			esc_attr( $this->getClasses( $attributes ) . ' surecart-block bump-title' ),
			esc_attr( $this->getStyles( $attributes ) ),
			wp_kses_post( $bump->metadata->cta ?? '' )
		);
		return '';
	}
}

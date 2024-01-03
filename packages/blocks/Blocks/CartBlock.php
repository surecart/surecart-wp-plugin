<?php

namespace SureCartBlocks\Blocks;

use SureCartBlocks\Util\BlockStyleAttributes;

/**
 * Cart block.
 */
abstract class CartBlock extends BaseBlock {
	/**
	 * Get the cart block style.
	 *
	 * @param array $attributes Array of block attributes.
	 *
	 * @return string
	 */
	public function getStyle( $attributes ) {
		$styles = '';
		if ( ! empty( $attributes['border'] ) ) {
			$styles .= 'border-bottom:var(--sc-drawer-border);';
		}
		if ( ! empty( $attributes['backgroundColor'] ) ) {
			$styles .= 'background-color:' . BlockStyleAttributes::maybeSanitizeHexColor( $attributes['backgroundColor'] ) . ';';
		}
		if ( ! empty( $attributes['textColor'] ) ) {
			$styles .= 'color:' . BlockStyleAttributes::maybeSanitizeHexColor( $attributes['textColor'] ) . ';';
			$styles .= '--sc-input-label-color:' . BlockStyleAttributes::maybeSanitizeHexColor( $attributes['textColor'] ) . ';';
			$styles .= '--sc-line-item-description-color:' . BlockStyleAttributes::maybeSanitizeHexColor( $attributes['textColor'] ) . ';';
		}
		if ( ! empty( $attributes['padding']['top'] ) ) {
			$styles .= 'padding-top:' . esc_attr( $attributes['padding']['top'] ) . ';';
		}
		if ( ! empty( $attributes['padding']['bottom'] ) ) {
			$styles .= 'padding-bottom:' . esc_attr( $attributes['padding']['bottom'] ) . ';';
		}
		if ( ! empty( $attributes['padding']['left'] ) ) {
			$styles .= 'padding-left:' . esc_attr( $attributes['padding']['left'] ) . ';';
		}
		if ( ! empty( $attributes['padding']['right'] ) ) {
			$styles .= 'padding-right:' . esc_attr( $attributes['padding']['right'] ) . ';';
		}
		return $styles;
	}
}

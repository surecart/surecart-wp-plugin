<?php

namespace SureCartBlocks\Blocks;

/**
 * Checkout block
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
		return ! empty( $attributes['border'] ) ? 'border-bottom: var(--sc-drawer-border);' : 'padding-bottom: 0;';
	}
}

<?php

namespace SureCartBlocks\Blocks\Product\Quantity;

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
		ob_start(); ?>
		<div class="<?php echo esc_attr( $this->getClasses( $attributes, 'surecart-block' ) ); ?>"
		style="<?php echo esc_attr( $this->getStyles( $attributes ) ); ?>">
			<sc-form-control
			label="<?php echo esc_attr( $attributes['label'] ); ?>">
				<sc-quantity-select></sc-quantity-select>
			</sc-form-control>
		</div>
		<?php
		return ob_get_clean();
	}
}

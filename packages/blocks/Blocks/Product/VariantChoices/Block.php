<?php

namespace SureCartBlocks\Blocks\Product\VariantChoices;

use SureCartBlocks\Blocks\BaseBlock;
use SureCartBlocks\Util\BlockStyleAttributes;

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
		[ 'styles' => $styles] = BlockStyleAttributes::getClassesAndStylesFromAttributes( $attributes, [ 'margin', 'padding' ] );
		ob_start(); ?>
		<sc-product-variation-choices
			style="
				<?php echo esc_attr( $styles ); ?>
				<?php echo '--sc-variation-gap: ' . esc_attr( $attributes['gap'] ) ?>
			"
		>
		</sc-product-variation-choices>
		<?php
		return ob_get_clean();
	}
}

<?php

namespace SureCartBlocks\Blocks\ProductPrices;

use SureCart\Models\Price;
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
		// get prices from post meta.
		$prices = (array) get_post_meta( get_the_ID(), 'prices' ); // we don't want to return true here since we are looking for the array.

		// get block classes and styles.
		[ 'classes' => $classes, 'styles' => $styles ] = BlockStyleAttributes::getClassesAndStylesFromAttributes( $attributes );
		// get text align class.
		['class' => $text_align_class] = BlockStyleAttributes::getTextAlignClassAndStyle( $attributes );

		ob_start(); ?>

		<div class="surecart-block <?php echo esc_attr( $classes ); ?> <?php echo esc_attr( $text_align_class ); ?>" style="<?php echo esc_attr( $styles ); ?>">
			<sc-format-number type="currency" currency="<?php echo esc_attr( $prices[0]->currency ); ?>" value="<?php echo (int) $prices[0]->amount; ?>"></sc-format-number>
		</div>

		<?php
		return ob_get_clean();
	}
}

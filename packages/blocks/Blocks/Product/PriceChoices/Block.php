<?php

namespace SureCartBlocks\Blocks\Product\PriceChoices;

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
		[ 'styles' => $styles] = BlockStyleAttributes::getClassesAndStylesFromAttributes( $attributes, [ 'margin' ] );
		ob_start(); ?>

		<sc-product-price-choices
			label="<?php echo esc_attr( $attributes['label'] ?? '' ); ?>"
			class="surecart-block product-price-choices"
			style="<?php echo esc_attr( $this->getVars( $attributes, '--sc-choice' ) ); ?> --columns: <?php echo esc_attr( $attributes['columns'] ?? 2 ); ?>; border: none; <?php echo esc_attr( $styles ); ?>"
			<?php echo ( ! empty( $attributes['show_price'] ) ? 'show-price' : '' ); ?>>
		</sc-product-price-choices>

		<?php
		return ob_get_clean();
	}
}

<?php

namespace SureCartBlocks\Blocks\ProductDonationRecurringPrices;

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
		<sc-product-donation-choices
			style="<?php echo esc_attr( $this->getVars( $attributes, '--sc-choice' ) ); ?> --columns:<?php echo intval( $attributes['columns'] ?? 1 ); ?> <?php echo esc_attr( $styles ); ?> "
			label="<?php echo esc_attr( $attributes['label'] ?? '' ); ?>"
			recurring="<?php echo ! empty( $attributes['recurring'] ) ? 'true' : 'false'; ?>"
			product-id="<?php echo esc_attr( $this->block->context['surecart/product-donation/product_id'] ?? '' ); ?>"
		></sc-product-donation-choices>
		<?php
		return ob_get_clean();
	}
}

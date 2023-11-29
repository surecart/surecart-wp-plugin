<?php

namespace SureCartBlocks\Blocks\ProductDonationPrices;

use SureCart\Models\Product;
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

		$product = Product::with( [ 'prices' ] )->find( $this->block->context['surecart/product-donation/product_id'] );
		if ( is_wp_error( $product ) ) {
			return $product->get_error_message();
		}

		// must have a minimum of 2 prices to show choices.
		if ( count( $product->activePrices() ) < 2 ) {
			return '';
		}

		ob_start(); ?>
		<div class="sc-product-donation-choices" style="<?php echo esc_attr( $this->getVars( $attributes, '--sc-choice' ) ); ?> --columns:<?php echo intval( $attributes['columns'] ); ?>; border: none; <?php echo esc_attr( $styles ); ?>">
			<sc-choices label="<?php echo esc_attr( $attributes['label'] ); ?>">
				<?php echo filter_block_content( $content ); ?>
			</sc-choices>
		</div>
		<?php
		return ob_get_clean();
	}
}

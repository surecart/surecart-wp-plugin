<?php

namespace SureCartBlocks\Blocks\ProductDonationAmount;

use SureCartBlocks\Blocks\BaseBlock;

/**
 * Logout Button Block.
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
            <sc-product-donation-amount-choice 
                value="<?php echo esc_attr( $attributes['amount'] ?? '' ); ?>"
                product-id="<?php echo esc_attr( $this->block->context['surecart/product-donation/product_id'] ?? '' ); ?>"
                label="<?php echo esc_attr( $attributes['label'] ?? '' ); ?>"
                currency-code="<?php echo esc_attr( $attributes['currency'] ?? 'USD' ); ?>"
            >
            </sc-product-donation-amount-choice>
        <?php
		return ob_get_clean();
	}
}

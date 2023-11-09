<?php

namespace SureCartBlocks\Blocks\CustomDonationAmount;

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
			<sc-product-donation-custom-amount
				currencyCode="<?php echo esc_attr( $attributes['currency'] ?? 'USD' ); ?>"
				product-id="<?php echo esc_attr( $this->block->context['surecart/product-donation/product_id'] ?? '' ); ?>"
			>
			</sc-product-donation-custom-amount>
		<?php
		return ob_get_clean();
	}
}

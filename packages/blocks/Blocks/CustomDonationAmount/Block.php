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
        $currency = $attributes['currency'] ?? 'USD';

        ob_start(); ?>
            <sc-custom-donation-amount
                currencyCode="<?php echo esc_attr( $currency ); ?>"
            >
            </sc-custom-donation-amount>
        <?php
		return ob_get_clean();
	}
}

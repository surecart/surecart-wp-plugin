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
        $amount = $attributes['amount'] ?? '';
        $label = $attributes['label'] ?? '';
        $custom_amount = $attributes['custom_amount'] ?? false;
        $currency = $attributes['currency'] ?? 'USD';

        ob_start(); ?>
            <sc-choice-container show-control="false" size="small" value="<?php echo esc_attr( $amount ); ?>">
            <?php if ( $label ) {
                echo esc_html( $label );
            } else {
                ?>
                    <sc-format-number
                        type="currency"
                        currency="<?php echo esc_attr( $currency ); ?>"
                        value="<?php echo esc_attr( $amount ); ?>"
                        minimum-fraction-digits="0"
                    ></sc-format-number>
            <?php } ?>
            </sc-choice-container>
        <?php
		return ob_get_clean();
	}
}

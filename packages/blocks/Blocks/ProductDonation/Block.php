<?php

namespace SureCartBlocks\Blocks\ProductDonation;

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

		$amount_label = $attributes['amount_label'] ?? '';
		$recurring_label = $attributes['recurring_label'] ?? '';
		$recurring_choice_label = $attributes['recurring_choice_label'] ?? '';
		$non_recurring_choice_label = $attributes['non_recurring_choice_label'] ?? '';
		$amount_columns = $attributes['amount_columns'] ?? 3;
		$product_id = $attributes['product_id'] ?? '';
		ob_start(); ?>

		<sc-product-donation-choices
			amount-label="<?php echo esc_attr( $amount_label ); ?>"
			recurring-label="<?php echo esc_attr( $recurring_label ); ?>"
			recurring-choice-label="<?php echo esc_attr( $recurring_choice_label ); ?>"
			non-recurring-choice-label="<?php echo esc_attr( $non_recurring_choice_label ); ?>"
			amount-columns="<?php echo esc_attr( $amount_columns ); ?>"
			product="<?php echo esc_attr( $product_id ); ?>"
			style="<?php echo esc_attr( $this->getVars( $attributes, '--sc-choice' ) ); ?> border: none; <?php echo esc_attr( $styles ); ?>"
		>
			<?php echo $content; ?>
		</sc-product-donation-choices>
		<?php
		return ob_get_clean();
	}
}

<?php

namespace SureCartBlocks\Blocks\Product\VariantChoices;

use SureCartBlocks\Blocks\BaseBlock;

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
		$product = get_query_var( 'surecart_current_product' );
		if ( empty( $product ) || empty( $product->variant_options->data ) ) {
			return '';
		}
		ob_start(); ?>

		<?php foreach ( $product->variant_options->data as $key => $option ) : ?>
			<?php if ( 'pills' === $attributes['type'] ) : ?>
				<sc-product-pills-variant-option label="<?php echo esc_attr( $option->name ); ?>" option-number="<?php echo (int) $key + 1; ?>"></sc-product-pills-variant-option>
			<?php else : ?>
				<sc-product-select-variant-option label="<?php echo esc_attr( $option->name ); ?>" option-number="<?php echo (int) $key + 1; ?>"></sc-product-select-variant-option>
			<?php endif; ?>
		<?php endforeach; ?>

		<?php
		return ob_get_clean();
	}
}

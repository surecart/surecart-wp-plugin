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
		// check for product.
		$product = get_query_var( 'surecart_current_product' );
		if ( empty( $product ) || empty( $product->variant_options->data ) ) {
			return '';
		}

		// get wrapper attributes.
		$wrapper_attributes = get_block_wrapper_attributes(
			[
				'style' => 'border: none;' . esc_attr( $this->getVars( $attributes, '--sc-pill-option' ) ),
			]
		);

		ob_start(); ?>

		<?php foreach ( $product->variant_options->data as $key => $option ) : ?>
			<sc-form-control label="<?php echo esc_attr( $option->name ); ?>">
				<sc-product-pills-variant-option  option-number="<?php echo (int) $key + 1; ?>" <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>></sc-product-pills-variant-option>
			</sc-form-control>
		<?php endforeach; ?>

		<?php
		return ob_get_clean();
	}
}

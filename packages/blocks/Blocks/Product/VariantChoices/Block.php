<?php

namespace SureCartBlocks\Blocks\Product\VariantChoices;

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
		// check for product.
		$product = get_query_var( 'surecart_current_product' );
		if ( empty( $product ) || empty( $product->variant_options->data ) ) {
			return '';
		}

		[ 'styles' => $styles] = BlockStyleAttributes::getClassesAndStylesFromAttributes( $attributes, [ 'margin' ] );

		// get wrapper attributes.
		$wrapper_attributes = get_block_wrapper_attributes(
			[
				'style' => 'border: none; display: block; margin-bottom: var(--sc-form-row-spacing, 0.75em);' . esc_attr( $this->getVars( $attributes, '--sc-pill-option' ) ),
			]
		);

		ob_start(); ?>

		<div style="<?php echo esc_attr( $styles ); ?>">
			<?php foreach ( $product->variant_options->data as $key => $option ) : ?>
				<sc-product-pills-variant-option label="<?php echo esc_attr( $option->name ); ?>" option-number="<?php echo (int) $key + 1; ?>" <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>></sc-product-pills-variant-option>
			<?php endforeach; ?>
		</div>

		<?php
		return ob_get_clean();
	}
}

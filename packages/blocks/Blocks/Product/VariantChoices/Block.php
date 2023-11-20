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
		$wrapper_attributes = $this->getWrapperAttributes( $attributes );

		ob_start(); ?>

		<div style="<?php echo esc_attr( $styles ); ?>">
			<?php foreach ( $product->variant_options->data as $key => $option ) : ?>
				<sc-product-pills-variant-option label="<?php echo esc_attr( $option->name ); ?>" option-number="<?php echo (int) $key + 1; ?>" <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>></sc-product-pills-variant-option>
			<?php endforeach; ?>
		</div>

		<?php
		return ob_get_clean();
	}

		/**
	 * Get the wrapper attributes
	 *
	 * @param array $attributes Block attributes.
	 *
	 * @return string
	 */
	private function getWrapperAttributes( $attributes ) {
		$extra_attributes = array(
			'style'=> 'border: none; display: block; margin-bottom: var(--sc-form-row-spacing, 0.75em);' . esc_attr( $this->getVars( $attributes, '--sc-pill-option' ) ),
		);

		if(!empty($attributes['is_shortcode'])){
			$attributes_string = '';
			foreach($extra_attributes as $key => $value){
				$attributes_string .= sprintf(' %s="%s"', esc_attr($key), esc_attr($value));
			}
			return $attributes_string;
		}

		$wrapper_attributes = get_block_wrapper_attributes($extra_attributes);

		return $wrapper_attributes;
	}
}

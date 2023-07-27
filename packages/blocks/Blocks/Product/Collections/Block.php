<?php

namespace SureCartBlocks\Blocks\Product\Collections;

use SureCart\Models\ProductCollection;
use SureCartBlocks\Blocks\BaseBlock;
use SureCartBlocks\Util\BlockStyleAttributes;

/**
 * Product Collection Block
 */
class Block extends BaseBlock {
	// public function getVars( $attr, $prefix ) {
	// $style = '';
	// padding.
	// if ( ! empty( $attr['style']['spacing']['padding'] ) ) {
	// $padding = $attr['style']['spacing']['padding'];
	// $style  .= $prefix . '-padding-top: ' . $this->getSpacingPresetCssVar( array_key_exists( 'top', $padding ) ? $padding['top'] : '0' ) . ';';
	// $style  .= $prefix . '-padding-bottom: ' . $this->getSpacingPresetCssVar( array_key_exists( 'bottom', $padding ) ? $padding['bottom'] : '0' ) . ';';
	// $style  .= $prefix . '-padding-left: ' . $this->getSpacingPresetCssVar( array_key_exists( 'left', $padding ) ? $padding['left'] : '0' ) . ';';
	// $style  .= $prefix . '-padding-right: ' . $this->getSpacingPresetCssVar( array_key_exists( 'right', $padding ) ? $padding['right'] : '0' ) . ';';
	// }
	// margin.
	// if ( ! empty( $attr['style']['spacing']['margin'] ) ) {
	// $margin = $attr['style']['spacing']['margin'];
	// $style .= $prefix . '-margin-top: ' . $this->getSpacingPresetCssVar( array_key_exists( 'top', $margin ) ? $margin['top'] : '0' ) . ';';
	// $style .= $prefix . '-margin-bottom: ' . $this->getSpacingPresetCssVar( array_key_exists( 'bottom', $margin ) ? $margin['bottom'] : '0' ) . ';';
	// $style .= $prefix . '-margin-left: ' . $this->getSpacingPresetCssVar( array_key_exists( 'left', $margin ) ? $margin['left'] : '0' ) . ';';
	// $style .= $prefix . '-margin-right: ' . $this->getSpacingPresetCssVar( array_key_exists( 'right', $margin ) ? $margin['right'] : '0' ) . ';';
	// }

	// border width.
	// if ( ! empty( $attr['style']['border']['width'] ) ) {
	// $style .= $prefix . '-border-width: ' . $attr['style']['border']['width'] . ';';
	// }
	// border radius.
	// if ( ! empty( $attr['style']['border']['radius'] ) ) {
	// $style .= $prefix . '-border-radius: ' . $attr['style']['border']['radius'] . ';';
	// }
	// font weight.
	// if ( ! empty( $attr['style']['typography']['fontWeight'] ) ) {
	// $style .= $prefix . '-font-weight: ' . $attr['style']['typography']['fontWeight'] . ';';
	// }
	// font size.
	// if ( ! empty( $attr['fontSize'] ) || ! empty( $attr['style']['typography']['fontSize'] ) ) {
	// $font_size = ! empty( $attr['fontSize'] ) ? $this->getFontSizePresetCssVar( $attr['fontSize'] ) : $attr['style']['typography']['fontSize'];
	// $style    .= $prefix . '-font-size: ' . $font_size . ';';
	// }
	// border color.
	// if ( ! empty( $attr['borderColor'] ) || ! empty( $attr['style']['border']['color'] ) ) {
	// $border_color = ! empty( $attr['borderColor'] ) ? $this->getColorPresetCssVar( $attr['borderColor'] ) : $attr['style']['border']['color'];
	// $style       .= $prefix . '-border-color: ' . $border_color . ';';
	// }
	// text color.
	// if ( ! empty( $attr['textColor'] ) || ! empty( $attr['style']['color']['text'] ) ) {
	// $text_color = ! empty( $attr['textColor'] ) ? $this->getColorPresetCssVar( $attr['textColor'] ) : $attr['style']['color']['text'];
	// $style     .= $prefix . '-text-color: ' . $text_color . ';';
	// }
	// background color.
	// if ( ! empty( $attr['backgroundColor'] ) || ! empty( $attr['style']['color']['background'] ) ) {
	// $text_color = ! empty( $attr['backgroundColor'] ) ? $this->getColorPresetCssVar( $attr['backgroundColor'] ) : $attr['style']['color']['background'];
	// $style     .= $prefix . '-background-color: ' . $text_color . ';';
	// }

	// return $style;
	// }

	/**
	 * Render the block
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content Post content.
	 *
	 * @return string
	 */
	public function render( $attributes, $content ) {
		$product                                     = get_query_var( 'surecart_current_product' );
		['styles' => $styles, 'classes' => $classes] = BlockStyleAttributes::getClassesAndStylesFromAttributes( $attributes );

		if ( empty( $product ) ) {
			return '';
		}

		$max_collection_count = (int) $attributes['collectionCount'];
		$collections          = ProductCollection::where(
			[
				'product_ids' => [ $product->id ],
			]
		)->get();

		$collections = array_splice( $collections, 0, $max_collection_count );

		ob_start(); ?>
			<sc-flex justify-content="flex-start" flex-wrap="wrap">
				<?php foreach ( $collections as $collection ) : ?>
					<span
					class="sc-product-collection-badge <?php echo esc_attr( $classes ); ?>"
					style="<?php echo esc_attr( $styles ); ?>"
					>
					<?php echo $collection->name; ?></span>
				<?php endforeach; ?>
			</sc-flex>
		<?php
		return ob_get_clean();
	}
}

<?php

namespace SureCartBlocks\Blocks\ProductItemList;

use SureCartBlocks\Blocks\BaseBlock;

/**
 * ProductItemList block
 */
class Block extends BaseBlock {
	/**
	 * Keeps track of instances of this block.
	 *
	 * @var integer
	 */
	static $instance;

	/**
	 * Get the style for the block
	 *
	 * @param  array $attributes Product List attributes.
	 * @return string
	 */
	public function getProductListStyle( $attr ) {
		$style  = '--sc-product-item-list-column: ' . ( $attr['columns'] ?? 3 ) . ';';
		$style .= '--sc-product-item-list-gap: ' . $this->getSpacingPresetCssVar( $attr['style']['spacing']['blockGap'] ?? '40px' ) . ';';
		return $style;
	}

	/**
	 * Get the style for the block
	 *
	 * @param  array $attributes Style variables.
	 * @return string
	 */
	public function getVars( $attr, $prefix ) {
		$style = '';
		// padding
		if ( ! empty( $attr['style']['spacing']['padding'] ) ) {
			$padding = $attr['style']['spacing']['padding'];
			$style  .= '--sc-product-' . $prefix . '-padding-top: ' . $this->getSpacingPresetCssVar( array_key_exists( 'top', $padding ) ? $padding['top'] : '0' ) . ';';
			$style  .= '--sc-product-' . $prefix . '-padding-bottom: ' . $this->getSpacingPresetCssVar( array_key_exists( 'bottom', $padding ) ? $padding['bottom'] : '0' ) . ';';
			$style  .= '--sc-product-' . $prefix . '-padding-left: ' . $this->getSpacingPresetCssVar( array_key_exists( 'left', $padding ) ? $padding['left'] : '0' ) . ';';
			$style  .= '--sc-product-' . $prefix . '-padding-right: ' . $this->getSpacingPresetCssVar( array_key_exists( 'right', $padding ) ? $padding['right'] : '0' ) . ';';
		}
		// margin
		if ( ! empty( $attr['style']['spacing']['margin'] ) ) {
			$margin = $attr['style']['spacing']['margin'];
			$style .= '--sc-product-' . $prefix . '-margin-top: ' . $this->getSpacingPresetCssVar( array_key_exists( 'top', $margin ) ? $margin['top'] : '0' ) . ';';
			$style .= '--sc-product-' . $prefix . '-margin-bottom: ' . $this->getSpacingPresetCssVar( array_key_exists( 'bottom', $margin ) ? $margin['bottom'] : '0' ) . ';';
			$style .= '--sc-product-' . $prefix . '-margin-left: ' . $this->getSpacingPresetCssVar( array_key_exists( 'left', $margin ) ? $margin['left'] : '0' ) . ';';
			$style .= '--sc-product-' . $prefix . '-margin-right: ' . $this->getSpacingPresetCssVar( array_key_exists( 'right', $margin ) ? $margin['right'] : '0' ) . ';';
		}
		// aspect ratio
		if ( ! empty( $attr['ratio'] ) ) {
			$style .= '--sc-product-' . $prefix . '-aspect-ratio: ' . $attr['ratio'] . ';';
		}
		// border width
		if ( ! empty( $attr['style']['border']['width'] ) ) {
			$style .= '--sc-product-' . $prefix . '-border-width: ' . $attr['style']['border']['width'] . ';';
		}
		// border radius
		if ( ! empty( $attr['style']['border']['radius'] ) ) {
			$style .= '--sc-product-' . $prefix . '-border-radius: ' . $attr['style']['border']['radius'] . ';';
		}
		// font weight
		if ( ! empty( $attr['style']['typography']['fontWeight'] ) ) {
			$style .= '--sc-product-' . $prefix . '-font-weight: ' . $attr['style']['typography']['fontWeight'] . ';';
		}
		// font size
		if ( ! empty( $attr['fontSize'] ) || ! empty( $attr['style']['typography']['fontSize'] ) ) {
			$font_size = ! empty( $attr['fontSize'] ) ? $this->getFontSizePresetCssVar( $attr['fontSize'] ) : $attr['style']['typography']['fontSize'];
			$style .= '--sc-product-' . $prefix . '-font-size: ' . $font_size . ';';
		}
		// border color
		if ( ! empty( $attr['borderColor'] ) || ! empty( $attr['style']['border']['color'] ) ) {
			$border_color = ! empty( $attr['borderColor'] ) ? $this->getColorPresetCssVar( $attr['borderColor'] ) : $attr['style']['border']['color'];
			$style .= '--sc-product-' . $prefix . '-border-color: ' . $border_color . ';';
		}
		// text color
		if ( ! empty( $attr['textColor'] ) || ! empty( $attr['style']['color']['text'] ) ) {
			$text_color = ! empty( $attr['textColor'] ) ? $this->getColorPresetCssVar( $attr['textColor'] ) : $attr['style']['color']['text'];
			$style .= '--sc-product-' . $prefix . '-text-color: ' . $text_color . ';';
		}
		// text align
		if ( ! empty( $attr['align'] ) ) {
			$style .= '--sc-product-' . $prefix . '-align: ' . $attr['align'] . ';';
		}

		return $style;
	}

	/**
	 * Get the style for the block
	 *
	 * @param  array $attributes Product list & Product item attributes.
	 * @return string
	 */
	public function getStyle( $attr, $item_attributes ) {
		$style  = 'border-style: none !important;';
		$style .= $this->getProductListStyle( $attr );
		$style .= $this->getVars( $item_attributes, 'item' );
		return $style;
	}

	/**
	 * Render the block
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content Post content.
	 *
	 * @return string
	 */
	public function render( $attributes, $content ) {
		self::$instance++;

		// check for inner blocks.
		$product_inner_blocks = $this->block->parsed_block['innerBlocks'];
		if ( empty( $product_inner_blocks[0]['innerBlocks'] ) ) {
			return;
		}

		$product_item_inner_blocks = $product_inner_blocks[0]['innerBlocks'];
		$product_item_attributes   = $product_inner_blocks[0]['attrs'];

		$layout_config = array_map(
			function( $inner_block ) {
				return (object) [
					'blockName'  => $inner_block['blockName'],
					'attributes' => $inner_block['attrs'],
				];
			},
			$product_item_inner_blocks
		);

		$style = '';
		$style .= $this->getStyle( $attributes, $product_item_attributes );

		foreach ($product_item_inner_blocks as $inner_blocks) {
			switch ($inner_blocks['blockName']) {
				case 'surecart/product-item-image':
					$style .= $this->getVars($inner_blocks['attrs'], 'image');
					break;
				case 'surecart/product-item-title':
					$style .= $this->getVars($inner_blocks['attrs'], 'title');
					break;
				case 'surecart/product-item-price':
					$style .= $this->getVars($inner_blocks['attrs'], 'price');
					break;
				default:
					break;
			}
		}

		\SureCart::assets()->addComponentData(
			'sc-product-item-list',
			'#selector-' . self::$instance,
			[
				'layoutConfig' 			=> $layout_config,
				'paginationAlignment' 	=> $attributes['pagination_alignment'],
				'limit' 				=> $attributes['limit'],
				'style'        			=> $style,
			]
		);

		return '<sc-product-item-list id="selector-' . esc_attr( self::$instance ) . '"></sc-product-item-list>';
	}
}

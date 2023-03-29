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
		$style = '';
		if ( ! empty( $attr['columns'] ) ) {
			$style .= '--sc-product-item-list-column: ' . $attr['columns'] . ';';
		}
		if ( ! empty( $attr['gap'] ) ) {
			$style .= '--sc-product-item-list-gap: ' . $this->getSpacingPresetCssVar( $attr['style']['spacing']['blockGap'] ?? '1rem' ) . ';';
		}
		return $style;
	}

	/**
	 * Get the style for the block
	 *
	 * @param  array $attributes Product Item attributes.
	 * @return string
	 */
	public function getProductItemStyle( $attr ) {
		$style = '';
		// var_dump($attr);
		if ( ! empty( $attr['style']['spacing']['padding'] ) ) {
			$padding = $attr['style']['spacing']['padding'];
			$style  .= '--sc-product-item-padding-top: ' . $this->getSpacingPresetCssVar( array_key_exists( 'top', $padding ) ? $padding['top'] : '0.88rem' ) . ';';
			$style  .= '--sc-product-item-padding-bottom: ' . $this->getSpacingPresetCssVar( array_key_exists( 'bottom', $padding ) ? $padding['bottom'] : '0.88rem' ) . ';';
			$style  .= '--sc-product-item-padding-left: ' . $this->getSpacingPresetCssVar( array_key_exists( 'left', $padding ) ? $padding['left'] : '0.88rem' ) . ';';
			$style  .= '--sc-product-item-padding-right: ' . $this->getSpacingPresetCssVar( array_key_exists( 'right', $padding ) ? $padding['right'] : '0.88rem' ) . ';';
		}
		if ( ! empty( $attr['style']['spacing']['margin'] ) ) {
			$margin = $attr['style']['spacing']['margin'];
			$style .= '--sc-product-item-margin-top: ' . $this->getSpacingPresetCssVar( array_key_exists( 'top', $margin ) ? $margin['top'] : '0' ) . ';';
			$style .= '--sc-product-item-margin-bottom: ' . $this->getSpacingPresetCssVar( array_key_exists( 'bottom', $margin ) ? $margin['bottom'] : '0' ) . ';';
			$style .= '--sc-product-item-margin-left: ' . $this->getSpacingPresetCssVar( array_key_exists( 'left', $margin ) ? $margin['left'] : '0' ) . ';';
			$style .= '--sc-product-item-margin-right: ' . $this->getSpacingPresetCssVar( array_key_exists( 'right', $margin ) ? $margin['right'] : '0' ) . ';';
		}
		if ( ! empty( $attr['style']['border']['color'] ) ) {
			$style .= '--sc-product-item-border-color: ' . $attr['style']['border']['color'] . ';';
		}
		if ( ! empty( $attr['style']['border']['width'] ) ) {
			$style .= '--sc-product-item-border-width: ' . $attr['style']['border']['width'] . ';';
		}
		if ( ! empty( $attr['style']['border']['radius'] ) ) {
			$style .= '--sc-product-item-border-radius: ' . $attr['style']['border']['radius'] . ';';
		}
		// var_dump($attr['borderColor']);
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
		$style .= $this->getProductItemStyle( $item_attributes );
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

		\SureCart::assets()->addComponentData(
			'sc-product-item-list',
			'#selector-' . self::$instance,
			[
				'layoutConfig' => $layout_config,
				'style'        => $this->getStyle( $attributes, $product_item_attributes ),
			]
		);

		return '<sc-product-item-list id="selector-' . esc_attr( self::$instance ) . '"></sc-product-item-list>';
	}
}

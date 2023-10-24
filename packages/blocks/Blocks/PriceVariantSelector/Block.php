<?php

namespace SureCartBlocks\Blocks\PriceVariantSelector;

use SureCart\Models\Component;
use SureCart\Models\Product;
use SureCartBlocks\Blocks\BaseBlock;

/**
 * Product Variant Selector Block.
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
	public function render( $attributes, $content = '' ) {
		$product  = (new Product())::with([
			'variants',
			'variant_options'
		])
		->find( $attributes['product_id'] );

		if(empty($product)){
			return '';
		}


		return wp_kses_post(
			Component::tag( 'sc-checkout-product-price-variant-selector' )
			->id( 'sc-checkout-product-price-variant-selector' )
			->with(
				[
					'product' => $product,
				]
			)->render( '' ) );
	}
}

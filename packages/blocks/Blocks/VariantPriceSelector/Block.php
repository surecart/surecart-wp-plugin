<?php

namespace SureCartBlocks\Blocks\VariantPriceSelector;

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
		$product = Product::with(
			[
				'prices',
				'variants',
				'variant_options',
			]
		)->find( $attributes['product_id'] );

		if ( empty( $product ) ) {
			return '';
		}

		// active prices.
		$active_prices            = $product->activePrices();
		$first_variant_with_stock = $product->getFirstVariantWithStock();

		// must have at least one active price.
		if ( empty( $active_prices[0] ) ) {
			return '';
		}

		if ( ! empty( $active_prices[0]->id ) ) {
			$line_item = array_merge(
				[
					'price_id' => $active_prices[0]->id,
					'quantity' => 1,
				],
				! empty( $first_variant_with_stock->id ) ? [ 'variant_id' => $first_variant_with_stock->id ] : []
			);

			sc_initial_state(
				[
					'checkout' => [
						'initialLineItems' => sc_initial_line_items( [ $line_item ] ),
					],
				]
			);
		}

		return wp_kses_post(
			Component::tag( 'sc-checkout-product-price-variant-selector' )
			->id( 'sc-checkout-product-price-variant-selector' )
			->with(
				[
					'product' => $product,
					'label'   => ! empty( $attributes['label'] ) ? $attributes['label'] : '',
				]
			)->render( '' )
		);
	}
}

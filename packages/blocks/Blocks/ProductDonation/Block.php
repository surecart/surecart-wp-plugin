<?php

namespace SureCartBlocks\Blocks\ProductDonation;

use SureCart\Models\Product;
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
		if ( empty( $attributes['product_id'] ) ) {
			return '';
		}

		// get the product.
		$product = Product::with( [ 'prices' ] )->find( $attributes['product_id'] ?? '' );
		if ( is_wp_error( $product ) ) {
			return $product->get_error_message();
		}

		// no ad_hoc prices.
		if ( ! count( $product->activeAdHocPrices() ) ) {
			return false;
		}

		// get amounts from inner blocks.
		$amounts = $this->getAmounts();
		if ( empty( $amounts ) ) {
			return false;
		}

		// set initial state.
		sc_initial_state(
			[
				'checkout'        => [
					'initialLineItems' => sc_initial_line_items( $this->getInitialLineItems( $product, $amounts ) ),
				],
				'productDonation' => [
					$attributes['product_id'] => [
						'product'       => $product->toArray(),
						'amounts'       => $amounts,
						'ad_hoc_amount' => null,
						'custom_amount' => null,
						'selectedPrice' => ( $product->activePrices() || [] )[0] ?? null,
					],
				],
			]
		);

		return filter_block_content( $content );
	}

	/**
	 * Get the initial line items.
	 *
	 * @return array
	 */
	public function getInitialLineItems( $product, $amounts ) {
		if ( empty( $product->activeAdHocPrices() ) || empty( $amounts ) ) {
			return [];
		}

		// Get first value from amounts that is in range of price ad_hoc_min_amount & ad_hoc_max_amount.
		$ad_hoc_amount = $amounts[0] ?? '';

		foreach ( $amounts as $amount ) {
			if ( $amount >= $product->activeAdHocPrices()[0]->ad_hoc_min_amount && $amount <= $product->activeAdHocPrices()[0]->ad_hoc_max_amount ) {
				$ad_hoc_amount = $amount;
				break;
			}
		}

		return array(
			[
				'price'         => $product->activeAdHocPrices()[0]->id,
				'ad_hoc_amount' => $ad_hoc_amount,
				'quantity'      => 1,
			],
		);
	}

	/**
	 * Get the amounts.
	 *
	 * @return array
	 */
	public function getAmounts() {
		$amounts_block = array_filter(
			$this->block->parsed_block['innerBlocks'],
			function( $block ) {
				return 'surecart/product-donation-amounts' === $block['blockName'];
			},
		);

		if ( empty( $amounts_block[0]['innerBlocks'] ) ) {
			return false;
		}

		// get amounts from inner blocks.
		return array_values( array_filter(
			array_map(
				function( $block ) {
					return $block['attrs']['amount'] ?? '';
				},
				$amounts_block[0]['innerBlocks']
			)
		) );
	}
}

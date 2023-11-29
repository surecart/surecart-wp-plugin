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

		$product = Product::with( [ 'prices' ] )->find( $attributes['product_id'] ?? '' );
		if ( is_wp_error( $product ) ) {
			return $product->get_error_message();
		}

		$amounts_block = array_filter(
			$this->block->parsed_block['innerBlocks'],
			function( $block ) {
				return 'surecart/product-donation-amounts' === $block['blockName'];
			},
		);

		if ( empty( $amounts_block[0]['innerBlocks'] ) ) {
			return '';
		}

		// get amounts from inner blocks.
		$amounts = array_filter(
			array_map(
				function( $block ) {
					return $block['attrs']['amount'] ?? '';
				},
				$amounts_block[0]['innerBlocks']
			)
		);

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
						'ad_hoc_amount' => $amounts[0] ?? '' ?? '',
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
		if ( empty( $product->prices->data[0] ) || empty( $amounts ) ) {
			return [];
		}

		// Get first value from amounts that is in range of price ad_hoc_min_amount & ad_hoc_max_amount.
		$ad_hoc_amount = $amounts[0] ?? '';

		foreach ( $amounts as $amount ) {
			if ( $amount >= $product->prices->data[0]->ad_hoc_min_amount && $amount <= $product->prices->data[0]->ad_hoc_max_amount ) {
				$ad_hoc_amount = $amount;
				break;
			}
		}

		return array(
			[
				'price'         => $product->prices->data[0]->id,
				'ad_hoc_amount' => $ad_hoc_amount,
				'quantity'      => 1,
			],
		);
	}

	/**
	 * Get any existing line items.
	 *
	 * @return array
	 */
	public function getExistingLineItems() {
		$initial = sc_initial_state();
		return ! empty( $initial['checkout']['initialLineItems'] ) ? $initial['checkout']['initialLineItems'] : [];
	}
}

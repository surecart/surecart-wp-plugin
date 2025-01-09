<?php

namespace SureCartBlocks\Blocks\BuyButton;

use SureCart\Support\Currency;
use SureCartBlocks\Blocks\BaseBlock;
use SureCart\Models\Variant;
use SureCart\Models\Price;

/**
 * Buy Button Block.
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
		$styles = '';
		if ( ! empty( $attributes['backgroundColor'] ) ) {
			$styles .= "background-color: {$attributes['backgroundColor']}; ";
		}
		if ( ! empty( $attributes['textColor'] ) ) {
			$styles .= "color: {$attributes['textColor']}; ";
		}

		$amount = $attributes['amount'] ?? null;
		if ( 'none' !== $attributes['amount_placement'] ) {
			// find the amount for this product only if there is only one line item.
			$line_items = $this->lineItems( $attributes['line_items'] ?? [] );
			if ( 1 === count( $line_items ) ) {
				$line_item = $line_items[0];
				$variant   = null;
				$price     = Price::find( $line_item['price_id'] );
				if ( ! empty( $line_item['variant_id'] ) ) {
					$variant = Variant::find( $line_item['variant_id'] );
				}

				if ( $price->ad_hoc ) {
					$amount = $amount ?? $variant->amount ?? $price->amount ?? null;

					// If the amount is greater than the max amount, set it to the max amount.
					if ( $amount > $price->ad_hoc_max_amount ) {
						$amount = $price->ad_hoc_max_amount;
					}
				} else {
					$amount = $variant->amount ?? $price->amount ?? null;
				}

				if ( ! empty( $amount ) ) {
					$amount = Currency::format( $amount );
				}
			}
		}

		return \SureCart::block()->render(
			'blocks/buy-button',
			[
				'type'             => $attributes['type'] ?? 'primary',
				'size'             => $attributes['size'] ?? 'medium',
				'style'            => $styles,
				'class'            => 'sc-button wp-element-button wp-block-button__link sc-button__link',
				'href'             => $this->href( $attributes['line_items'] ?? [] ),
				'label'            => $attributes['label'] ?? __( 'Buy Now', 'surecart' ),
				'amount'           => $amount,
				'amount_placement' => ! empty( $attributes['amount_placement'] ) ? $attributes['amount_placement'] : 'none',
			]
		);
	}

	/**
	 * Build the line items array.
	 *
	 * @param array $line_items Line items.
	 * @return array Line items.
	 */
	public function lineItems( $line_items ) {
		return array_map(
			function ( $item ) {
				return [
					'price_id'   => $item['id'] ?? null,
					'variant_id' => $item['variant_id'] ?? null,
					'quantity'   => $item['quantity'] ?? 1,
				];
			},
			$line_items ?? []
		);
	}

	/**
	 * Build the button url.
	 *
	 * @param array $line_items Line items.
	 * @return string url
	 */
	public function href( $line_items = [] ) {
		return add_query_arg(
			[
				'line_items' => $this->lineItems( $line_items ?? [] ),
				'no_cart'    => true,
			],
			\SureCart::pages()->url( 'checkout' )
		);
	}
}

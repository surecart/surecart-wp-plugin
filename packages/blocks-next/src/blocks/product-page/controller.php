<?php
// get product.

use SureCart\Models\Blocks\ProductPageBlock;

$product = sc_get_product();

// if no product id, return.
if ( empty( $product ) ) {
	return;
}

$selected_price   = $product->initial_price;
$controller       = new ProductPageBlock( $block );
$selected_variant = $controller->getSelectedVariant();

wp_interactivity_state(
	'surecart/product-page',
	array(
		'quantity'                     => 1,
		'selectedDisplayAmount'        => $product->display_amount,
		'selectedScratchDisplayAmount' => ! empty( $selected_price ) ? $selected_price->scratch_display_amount : '',
		'isOnSale'                     => empty( $selected_price->ad_hoc ) ? $product->scratch_amount > $product->initial_amount : false,
		'busy'                         => false,
		'adHocAmount'                  => ( ! empty( $selected_price->ad_hoc ) ? $selected_price->amount : 0 ) / ( ! empty( $selected_price->is_zero_decimal ) ? 1 : 100 ),
		'selectedVariant'              => $selected_variant ?? null,
		'isOptionUnavailable'          => function () {
			$context = wp_interactivity_get_context();
			$variants = $context['variants'];
			$option = $context['option_value'];
			$product = $context['product'];
			$variant_values = $context['variantValues'];
			$option_number = $context['optionNumber'];

			// stock is not enabled.
			if ( $product['has_unlimited_stock'] ) {
				return false;
			}

			if ( 1 === $option_number ) {
				$items = array_filter(
					$variants ?? [],
					function ( $variant ) use ( $option ) {
						return $variant['option_1'] === $option;
					}
				);
				$highest_stock = max(
					array_map(
						function ( $item ) {
								return $item['available_stock'];
						},
						$items ?? []
					)
				);

				return $highest_stock <= 0;
			}

			if ( 2 === $option_number ) {
				$items = array_filter(
					$variants ?? [],
					function ( $variant ) use ( $variant_values, $option ) {
						return $variant['option_1'] === $variant_values['option_1'] && $variant['option_2'] === $option;
					}
				);
				$highest_stock = max(
					array_map(
						function ( $item ) {
							return $item['available_stock'];
						},
						$items
					)
				);
				return $highest_stock <= 0;
			}

			$items = array_filter(
				$variants ?? [],
				function ( $variant ) use ( $variant_values, $option ) {
					return $variant['option_1'] === $variant_values['option_1'] && $variant['option_2'] === $variant_values['option_2'] && $variant['option_3'] === $option;
				}
			);

			$highest_stock = max(
				array_map(
					function ( $item ) {
						return $item['available_stock'];
					},
					$items
				)
			);

			return $highest_stock <= 0;
		},
		'isOptionValueSelected'        => function () {
			$context = wp_interactivity_get_context();

			if ( empty( $context['optionValue'] ) ) {
				return true;
			}

			$values = array_map(
				function ( $value ) {
					return strtolower( $value );
				},
				array_values( $context['variantValues'] )
			);

			return in_array( strtolower( $context['optionValue'] ), $values );
		},
		'imageDisplay'                 => function () {
			$state = wp_interactivity_state();
			return $state['isOptionValueSelected']() ? 'block' : 'none';
		},
		'isSoldOut'                    => function () {
			$context = wp_interactivity_get_context();
			$state = wp_interactivity_state();
			$product = $context['product'];
			if ( $product['has_unlimited_stock'] ) {
				return false;
			}
			if ( ! empty( $context['variants'] ) && empty( $state['selectedVariant'] ) ) {
				return false;
			}
			return ! empty( $state['selectedVariant']->id ) ? $state['selectedVariant']->available_stock <= 0 : $product->available_stock <= 0;
		},
		'isUnavailable'                => function () {
			$context = wp_interactivity_get_context();
			$state = wp_interactivity_state();
			if ( ! empty( $context['product']->archived ) || ! empty( $state['isSoldOut']() ) ) {
				return true;
			}
			if ( ! empty( $context['variants'] ) && empty( $state['selectedVariant'] ) ) {
				return true;
			}
			return false;
		},
		'isOptionSelected'             => function () {
			$context = wp_interactivity_get_context();
			$option_number = $context['optionNumber'] ?? '';
			if ( ! isset( $context['variantValues'][ "option_$option_number" ] ) || ! isset( $context['option_value'] ) ) {
				return false;
			}
			return $context['variantValues'][ "option_$option_number" ] === $context['option_value'];
		},
		'isPriceSelected'              => function () {
			$context = wp_interactivity_get_context();
			if ( ! isset( $context['price'] ) || ! isset( $context['selectedPrice'] ) ) {
				return false;
			}
			return $context['price'] === $context['selectedPrice'];
		},
		'buttonText'                   => function () {
			$state = wp_interactivity_state();
			$context = wp_interactivity_get_context();
			if ( $state['isSoldOut']() ) {
				return $context['outOfStockText'] ?? $context['text'];
			}
			if ( $state['isUnavailable']() ) {
				return $context['unavailableText'] ?? $context['text'];
			}
			return $context['text'];
		},
	)
);

return 'file:./view.php';

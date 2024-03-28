<?php
// get product.
$product = get_query_var( 'surecart_current_product' );

// if no product id, return.
if ( empty( $product ) ) {
	return;
}

$active_prices  = $product->active_prices;
$selected_price = $active_prices[0] ?? '';

wp_interactivity_state(
	'surecart/product',
	array_merge(
		wp_interactivity_state( 'surecart/product' ),
		array(
			$product->id                 => array(
				'formId'          => \SureCart::forms()->getDefaultId(),
				'mode'            => \SureCart\Models\Form::getMode( \SureCart::forms()->getDefaultId() ),
				'product'         => $product,
				'prices'          => $active_prices,
				'selectedPrice'   => $selected_price,
				'isOnSale'        => $selected_price ? $selected_price->is_on_sale : false,
				'checkoutUrl'     => \SureCart::pages()->url( 'checkout' ),
				'variant_options' => $product->variant_options->data ?? array(),
				'variants'        => $product->variants->data ?? array(),
				'selectedVariant' => $product->first_variant_with_stock ?? null,
				'isProductPage'   => ! empty( get_query_var( 'surecart_current_product' ) ),
				'variantValues' => (object) array_filter([
					'option_1' => $product->first_variant_with_stock->option_1 ?? null,
					'option_2' => $product->first_variant_with_stock->option_2 ?? null,
					'option_3' => $product->first_variant_with_stock->option_3 ?? null,
				])
			),
			// These are needed in order to SSR directives.
			'busy' => false,
			'selectedPrice' => $selected_price,
			'buttonText' => __('Add To Cart', 'surecart'),
			'selectedVariant' => $product->first_variant_with_stock,
			'selectedDisplayAmount' => $product->display_amount,
			'selectedScratchDisplayAmount' => $selected_price->scratch_display_amount,
			'isOnSale' => $product->is_on_sale,
		)
	)
);

return 'file:./view.php';

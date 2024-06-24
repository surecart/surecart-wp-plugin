<?php
// get product.
$product = sc_get_product();

// if no product id, return.
if ( empty( $product ) ) {
	return;
}

$selected_price = $product->initial_price;

wp_interactivity_state(
	'surecart/product-page',
	array(
		'quantity'                     => 1,
		'selectedDisplayAmount'        => $product->display_amount,
		'selectedScratchDisplayAmount' => ! empty( $product->initial_price ) ? $product->initial_price->scratch_display_amount : '',
		'isOnSale'                     => ! empty( $product->initial_price ) ? $product->initial_price->is_on_sale : false,
		'busy'                         => false,
		'adHocAmount'                  => ( ! empty( $product->initial_price->ad_hoc ) ? $product->initial_price->amount : 0 ) / ( ! empty( $product->initial_price->is_zero_decimal ) ? 1 : 100 ),
	)
);

return 'file:./view.php';

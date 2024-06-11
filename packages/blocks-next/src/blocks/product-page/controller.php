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
		'busy'                         => false,
		'selectedPrice'                => $selected_price,
		'buttonText'                   => __( 'Add To Cart', 'surecart' ),
		'selectedVariant'              => $product->first_variant_with_stock,
		'selectedDisplayAmount'        => $product->display_amount,
		'selectedScratchDisplayAmount' => $selected_price->scratch_display_amount,
		'isOnSale'                     => $product->is_on_sale,
		'adHocAmount'                  => ( $selected_price->ad_hoc ? $selected_price->amount : 0 ) / ( $selected_price->is_zero_decimal ? 1 : 100 ),
	)
);

return 'file:./view.php';

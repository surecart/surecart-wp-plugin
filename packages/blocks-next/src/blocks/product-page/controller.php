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
	)
);

return 'file:./view.php';

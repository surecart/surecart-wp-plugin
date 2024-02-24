<?php

// TODO: In the future, we can just get the context passed from the wrapper block.
// get product page id.
$product_id = get_query_var( 'sc_product_page_id' ) ?? $attributes['productId'] ?? null;
// if no product id, return.
if ( empty( $product_id ) ) {
	return;
}

// set store currency.
wp_interactivity_state( 'surecart/currency', [
	'currency' => \SureCart::account()->currency,
]);

// get initial state.
$products = wp_interactivity_state( 'surecart/product' );
// get product from initial state.
$product = $products[ $product_id ]['product'] ?? null;

return 'file:./view.php';

<?php
$product = sc_get_product();

// Must have product with an initial price that is a bundle.
if ( empty( $product ) || empty( $product->initial_price ) || empty( $product->initial_price->bundle ) ) {
	return '';
}

// Must have bundle items.
$bundle_items = $product->initial_price->bundle_items->data ?? [];
if ( empty( $bundle_items ) ) {
	return '';
}

return 'file:./view.php';

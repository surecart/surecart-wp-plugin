<?php
// Get product from initial state.
$product = sc_get_product();

if ( empty( $product->id ) ) {
	return;
}

// Bundle product: render a picker per component option in a dedicated view. A
// bundle has no variants of its own — its component products carry the variants.
if ( ! empty( $product->bundle ) ) {
	return empty( $product->bundle_items->data ) ? '' : 'file:./bundle.php';
}

// Normal product: needs its own variant options to render anything.
if ( empty( $product->variant_options->data ) ) {
	return;
}

// return the view.
return 'file:./view.php';

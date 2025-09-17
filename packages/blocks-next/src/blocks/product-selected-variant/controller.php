<?php
$product = sc_get_product();

// make sure we have the product and variants.
if ( empty( $product ) || empty( $product->variants->data ) ) {
	return null;
}

$separator = isset( $attributes['separator'] ) ? $attributes['separator'] : ' / ';

return 'file:./view.php';

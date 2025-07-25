<?php
$product = sc_get_product();

// make sure we have the product and variants.
if ( empty( $product->variants ) ) {
	return '';
}

$separator = isset( $attributes['separator'] ) ? $attributes['separator'] : ' / ';

return 'file:./view.php';

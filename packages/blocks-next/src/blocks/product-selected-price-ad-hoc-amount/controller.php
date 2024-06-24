<?php
$product = sc_get_product();
// make sure we have a product.
if ( empty( $product->id ) ) {
	return '';
}

// return the view.
return 'file:./view.php';

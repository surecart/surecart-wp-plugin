<?php

$product = sc_get_product();

if ( ! $product || empty( $product->total_reviews ) ) {
	return '';
}

return 'file:./view.php';

<?php
$product = sc_get_product();
if ( empty( $product ) ) {
	return '';
}

$reviews = sc_product_review_list_query( $block, $product->id );

// return the view.
return 'file:./view.php';

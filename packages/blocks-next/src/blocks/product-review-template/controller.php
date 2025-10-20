<?php

$product = sc_get_product();
if ( empty( $product ) ) {
	return '';
}

// For Analytics.
$query   = sc_product_review_list_query( $block, $product->id );
$reviews = $query->data ?? [];

// return the view.
return 'file:./view.php';

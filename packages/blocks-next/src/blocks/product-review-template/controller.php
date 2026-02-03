<?php

$product = sc_get_product();
if ( empty( $product ) ) {
	return '';
}

$query   = sc_product_review_list_query( $block, $product->id );
$reviews = $query->data ?? [];

// Return empty view when filtered query returns no results.
if ( empty( $reviews ) ) {
	return 'file:./empty.php';
}

// return the view.
return 'file:./view.php';

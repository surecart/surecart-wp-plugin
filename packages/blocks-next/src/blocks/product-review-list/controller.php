<?php
$product = sc_get_product();

// no product.
if ( empty( $product ) ) {
	return;
}

// reviews are not enabled.
if ( ! apply_filters( 'surecart/review_form/enabled', $product->reviews_enabled ) ) {
	return;
}

$query   = sc_product_review_list_query( $block, $product->id );
$reviews = $query->data ?? [];

// return the view.
return 'file:./view.php';

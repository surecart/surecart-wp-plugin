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

// Hide if there are no reviews at all (total_reviews = 0).
if ( empty( $product->total_reviews ) ) {
	return;
}

// return the view.
return 'file:./view.php';

<?php
$product = sc_get_product();
if ( ! $product ) {
	return;
}

$show_for_zero_reviews = $attributes['show_for_zero_reviews'] ?? true;

// If show_for_zero_reviews is false and there are no reviews, return early.
if ( ! $show_for_zero_reviews && 0 === (int) $product->total_reviews ) {
	return;
}

return 'file:./view.php';

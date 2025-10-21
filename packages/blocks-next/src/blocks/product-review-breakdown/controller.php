<?php

$product = sc_get_product();

if ( ! $product ) {
	return;
}

$show_for_zero_reviews = $attributes['show_for_zero_reviews'] ?? true;

// If show_for_zero_reviews is false and there are no reviews, skip rendering the block.
if ( ! $show_for_zero_reviews && 0 === (int) $product->total_reviews ) {
	return;
}

$total = (int) $product->total_reviews;

return 'file:./view.php';

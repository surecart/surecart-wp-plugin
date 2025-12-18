<?php

$product = sc_get_product();
if ( ! $product ) {
	return '';
}

$show_for_zero_reviews = $attributes['show_for_zero_reviews'] ?? true;

// If show_for_zero_reviews is false and there are no reviews, return early.
if ( ! $show_for_zero_reviews && 0 === (int) $product->total_reviews ) {
	return '';
}

// Get rating and wrapper attributes.
$content = (string) $product->average_stars;
$wrapper = get_block_wrapper_attributes();

// Check for style classes and format accordingly.
if ( str_contains( $wrapper, 'is-style-parentheses' ) ) {
	$content = '(' . $content . ')';
} elseif ( str_contains( $wrapper, 'is-style-slash' ) ) {
	$content .= ' / 5.0';
}

// Get link_to_reviews from attribute.
$link_to_reviews = $attributes['link_to_reviews'] ?? false;

return 'file:./view.php';

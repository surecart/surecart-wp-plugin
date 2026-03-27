<?php
$product = sc_get_product();

// no product.
if ( empty( $product ) ) {
	return;
}

// reviews are not enabled.
if ( ! apply_filters( 'surecart/review_count/enabled', $product->reviews_enabled ) ) {
	return;
}

$show_for_zero_reviews = $attributes['show_for_zero_reviews'] ?? true;

// If show_for_zero_reviews is false and there are no reviews, skip rendering the block.
if ( ! $show_for_zero_reviews && 0 === (int) $product->total_reviews ) {
	return;
}

// Get the review count.
$count  = (int) $product->total_reviews;
$number = number_format_i18n( $count );

// Add class for CSS to conditionally show "+" only when count > 1.
$has_multiple_reviews = $count > 1 ? 'has-multiple-reviews' : '';

$link_to_reviews = $attributes['link_to_reviews'] ?? false;
$html_tag        = $link_to_reviews ? 'a' : 'div';

return 'file:./view.php';

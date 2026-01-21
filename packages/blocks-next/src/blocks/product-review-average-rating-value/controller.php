<?php
if ( ! ( $block->context['show_value'] ?? true ) ) {
	return;
}

$product = sc_get_product();

// no product.
if ( empty( $product ) ) {
	return;
}

// reviews are not enabled.
if ( ! apply_filters( 'surecart/review_average/enabled', $product->reviews_enabled ) ) {
	return;
}

// Get rating and wrapper attributes.
$content = (string) number_format( $product->average_stars, 1 );
$wrapper = get_block_wrapper_attributes();

// Check for style classes and format accordingly.
if ( strpos( $wrapper, 'is-style-parentheses' ) !== false ) {
	$content = '(' . $content . ')';
} elseif ( strpos( $wrapper, 'is-style-slash' ) !== false ) {
	$content .= ' / 5.0';
}

// Get link_to_reviews from context (parent block) or fallback to attribute.
$link_to_reviews = $block->context['link_to_reviews'] ?? $attributes['link_to_reviews'] ?? false;

return 'file:./view.php';

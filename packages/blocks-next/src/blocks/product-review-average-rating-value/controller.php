<?php

if ( ! ( $block->context['show_value'] ?? true ) ) {
	return '';
}

$product = sc_get_product();
if ( ! $product ) {
	return '';
}

// Get rating and wrapper attributes.
$content = (string) number_format( $product->average_stars, 1 );
$wrapper = get_block_wrapper_attributes();

// Check for style classes and format accordingly.
if ( str_contains( $wrapper, 'is-style-parentheses' ) ) {
	$content = '(' . $content . ')';
} elseif ( str_contains( $wrapper, 'is-style-slash' ) ) {
	$content .= ' / 5.0';
}

// Get link_to_reviews from context (parent block) or fallback to attribute.
$link_to_reviews = $block->context['link_to_reviews'] ?? $attributes['link_to_reviews'] ?? false;

return 'file:./view.php';

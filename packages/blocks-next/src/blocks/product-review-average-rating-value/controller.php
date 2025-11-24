<?php

if ( ! ( $block->context['show_value'] ?? true ) ) {
	return '';
}

$product = sc_get_product();
if ( ! $product ) {
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

return 'file:./view.php';

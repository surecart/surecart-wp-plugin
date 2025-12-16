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

$total      = (int) $product->total_reviews;
$fill_color = ! empty( $attributes['fill_color'] ) ? $attributes['fill_color'] : 'var(--sc-color-primary-500)';
$columns    = ! empty( $attributes['columns'] ) ? (int) $attributes['columns'] : 1;
$row_gap    = ! empty( $attributes['row_gap'] ) ? (int) $attributes['row_gap'] : 8;
$column_gap = ! empty( $attributes['column_gap'] ) ? (int) $attributes['column_gap'] : 20;

return 'file:./view.php';

<?php

$product = $block->context['surecart/product'];

if ( empty( $product ) ) {
	return '';
}

// get the collections expanded on the product.
$collections = $product->product_collections->data ?? [];

// we don't have any collections to display.
if ( empty( $collections ) ) {
	return '';
}

// Limit the number of items displayed based on the $attributes['count'] value.
if ( ! empty( $attributes['count'] ) ) {
	$collections = array_slice( $collections, 0, $attributes['count'] );
}

// get the styles & classes.
$styles = sc_get_block_styles();
$style = $styles['css'] ?? '';
$classes = $styles['classnames'] ?? '';

// return the view.
return 'file:./view.php';

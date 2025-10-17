<?php

$product = sc_get_product();
if ( empty( $product ) ) {
	return '';
}

// For Analytics.
$query   = sc_product_review_list_query( $block, $product->id );
$reviews = $query->data ?? [];

// Determine the wrapper attributes.
$wrapper_attributes = ( ! empty( $attributes['layout'] ) && ! empty( $attributes['layout']['columnCount'] ) ) ? array( 'class' => 'sc-product-review-template-columns-' . $attributes['layout']['columnCount'] ) : array();

// return the view.
return 'file:./view.php';

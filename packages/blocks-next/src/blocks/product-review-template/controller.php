<?php

// For Analytics.
$query   = sc_product_review_list_query( $block );
$reviews = $query;

// Determine the wrapper attributes.
$wrapper_attributes = ( ! empty( $attributes['layout'] ) && ! empty( $attributes['layout']['columnCount'] ) ) ? array( 'class' => 'sc-product-review-template-columns-' . $attributes['layout']['columnCount'] ) : array();

// return the view.
return 'file:./view.php';

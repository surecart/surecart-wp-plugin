<?php

$product = sc_get_product();

if ( empty( $product ) ) {
	return '';
}

// get the collections expanded on the product.
$collections = $product->product_collections->data ?? array();

// we don't have any collections to display.
if ( empty( $collections ) ) {
	return '';
}


// Limit the number of items displayed based on the $attributes['count'] value.
if ( ! empty( $attributes['count'] ) ) {
	$collections = array_slice( $collections, 0, $attributes['count'] );
}

// map through the collections and update the screen reader text.
foreach ( $collections as $collection ) {
	$collection->screen_reader_text = sprintf(
		/* translators: %s: collection name */
		__( 'Link to %s product collection.', 'surecart' ),
		$collection->name
	);
}


// return the view.
return 'file:./view.php';

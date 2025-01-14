<?php

global $sc_query_id;

// Set the intitial state used in SSR.
wp_interactivity_state(
	'surecart/product-list',
	[
		'loading'   => false,
		'searching' => false,
	]
);

// Create controller and run query.
$query    = sc_product_list_query( $block );
$products = $query->products;

if ( empty( $products ) ) {
	return;
}

// return the view.
return 'file:./view.php';

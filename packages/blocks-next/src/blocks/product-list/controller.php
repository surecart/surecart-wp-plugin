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

// For Analytics.
$query = sc_product_list_query( $block );

$products = is_array( $query->products ?? null )
	? array_map( [ \SureCart\Support\PublicCatalogData::class, 'product' ], $query->products )
	: $query->products;

// return the view.
return 'file:./view.php';

<?php

// get non-empty collections.
$collections = get_terms(
	array(
		'taxonomy'   => 'sc_collection',
		'hide_empty' => true,
	)
);

$block_id   = $block->context['surecart/product-list/block_id'];
$url        = \SureCart::block()->urlParams( 'products', $block_id );
$filter_key = $url->getKey( 'filter' );

$options = array_map(
	function( $collection ) use ( $url ) {
		return [
			'value'   => $collection->term_id,
			'label'   => $collection->name,
			'href'    => $url->hasFilterArg( 'sc_collection', $collection->term_id ) ? $url->removeFilterArg( 'sc_collection', $collection->term_id ) : $url->addFilterArg( 'sc_collection', $collection->term_id ),
			'checked' => $url->hasFilterArg( 'sc_collection', $collection->term_id ),
		];
	},
	$collections ?? []
);

// return the view.
return 'file:./view.php';

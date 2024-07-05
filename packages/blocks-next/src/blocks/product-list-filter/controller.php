<?php
global $sc_block_id;

// get non-empty collections.
$collections = get_terms(
	array(
		'taxonomy'   => 'sc_collection',
		'hide_empty' => true,
	)
);

// the parent is forcing a collection.
if ( ! empty( $block->context['surecart/product-list/collection_id'] ) ) {
	return '';
}

$url        = \SureCart::block()->urlParams( 'products', $sc_block_id );
$filter_key = $url->getKey( 'filter' );

$options = array_map(
	function ( $collection ) use ( $url ) {
		return [
			'value'   => $collection->term_id,
			'label'   => $collection->name,
			'href'    => $url->hasFilterArg( 'sc_collection', $collection->term_id ) ? $url->removeFilterArg( 'sc_collection', $collection->term_id ) : $url->addFilterArg( 'sc_collection', $collection->term_id ),
			'checked' => $url->hasFilterArg( 'sc_collection', $collection->term_id ),
		];
	},
	$collections ?? []
);

// no filter options.
if ( empty( $options ) ) {
	return '';
}

// return the view.
return 'file:./view.php';

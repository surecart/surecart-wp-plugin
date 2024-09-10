<?php
global $sc_query_id;

// get non-empty collections.
$collections = get_terms(
	array(
		'taxonomy'   => 'sc_collection',
		'hide_empty' => true,
	)
);

// we are on a collection page.
$current_term  = get_queried_object();
$collection_id = $attributes['collection_id'] ?? null; // collection id from the shortcode.
if ( is_a( $current_term, \WP_Term::class ) || ! empty( $collection_id ) ) {
	return '';
}

$url        = \SureCart::block()->urlParams( 'products' );
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

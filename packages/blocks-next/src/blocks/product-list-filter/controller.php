<?php
global $sc_query_id;

$taxonomy_slug   = $attributes['taxonomy'] ?? 'sc_collection';
$taxonomy_object = get_taxonomy( $taxonomy_slug );

// get non-empty collections.
$collections = get_terms(
	array(
		'taxonomy'   => $taxonomy_slug,
		'hide_empty' => true,
	)
);

// we are on a collection page.
$current_term = get_queried_object();
if ( is_a( $current_term, \WP_Term::class ) ) {
	return '';
}

$url        = \SureCart::block()->urlParams( 'products' );
$filter_key = $url->getKey( 'filter' );

$options = array_map(
	function ( $collection ) use ( $url, $taxonomy_slug ) {
		return [
			'value'   => $collection->term_id,
			'label'   => $collection->name,
			'href'    => $url->hasFilterArg( $taxonomy_slug, $collection->term_id ) ? $url->removeFilterArg( $taxonomy_slug, $collection->term_id ) : $url->addFilterArg( $taxonomy_slug, $collection->term_id ),
			'checked' => $url->hasFilterArg( $taxonomy_slug, $collection->term_id ),
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

<?php
// no collection id context.
if ( empty( $block->context['sc_collection_id'] ) ) {
	return;
}

// Get the collection.
$collection = get_term( $block->context['sc_collection_id'], 'sc_collection' );
if ( is_wp_error( $collection ) ) {
	return;
}

// Get the collection URL.
$url = get_term_link( $collection, 'sc_collection' );

// return the view.
return 'file:./view.php';

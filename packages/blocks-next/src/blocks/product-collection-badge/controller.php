<?php
if ( empty( $block->context['sc_collection_id'] ) ) {
	return;
}

$collection = get_term( $block->context['sc_collection_id'], 'sc_collection' );
if ( is_wp_error( $collection ) ) {
	return;
}

$url = get_term_link( $collection, 'sc_collection' );

return 'file:./view.php';

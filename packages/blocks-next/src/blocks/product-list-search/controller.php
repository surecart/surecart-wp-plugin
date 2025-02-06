<?php

// we have already defined a search query.
if ( ! empty( $block->context['query']['search'] ) ) {
	return null;
}

// get the search query.
$list_query = sc_product_list_query( $block );
$value      = $list_query->s;
// return the view.
return 'file:./view.php';

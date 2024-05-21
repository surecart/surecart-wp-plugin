<?php

// get non-empty collections.
$collections = get_terms(
	array(
		'taxonomy'   => 'sc_collection',
		'hide_empty' => false,
	)
);


$block_id   = $block->context['surecart/product-list/blockId'];
$filter_key = \SureCart::block()->urlParams( 'products' )->getKey( 'filter', $block_id );

$options = array_map(
	function( $collection ) use ( $filter_key, $block_id ) {
		return [
			'value'   => $collection->term_id,
			'label'   => $collection->name,
			'href'    => \SureCart::block()->urlParams( 'products' )->addFilterArg( 'sc_collection', $collection->term_id, $block_id ),
			'checked' => in_array( $collection->term_id, $_GET[ $filter_key ] ?? [] ),
		];
	},
	$collections ?? []
);

// return the view.
return 'file:./view.php';

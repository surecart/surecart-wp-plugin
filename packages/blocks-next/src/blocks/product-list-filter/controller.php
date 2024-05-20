<?php

use SureCart\Models\ProductCollection;

$product_collections  = ProductCollection::get( array( 'per_page' => -1 ) );
$block_id = $block->context["surecart/product-list/blockId"];
$filter_key = \SureCart::block()->urlParams('products')->getKey( 'filter', $block_id );

$options = array_map( function( $collection ) use ( $filter_key, $block_id ) {
	return [
		'value' => $collection->id,
		'label' => $collection->name,
		'href' => \SureCart::block()->urlParams('products')->addFilterArg('filter', $collection->id, $block_id ),
		'checked' => in_array( $collection->id, $_GET[ $filter_key ] ?? [] ),
	];
}, $product_collections ?? [] );

// return the view.
return 'file:./view.php';

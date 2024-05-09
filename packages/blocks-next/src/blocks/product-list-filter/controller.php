<?php

use SureCart\Models\ProductCollection;

$product_collections  = ProductCollection::get( array( 'per_page' => -1 ) );

$block_id = (int) $block->context["surecart/product-list/blockId"] ?? '';
$filter_key = isset( $block_id ) ? 'products-' . $block_id . '-filter' : 'products-filter';
$existing_filters = $_GET[ $filter_key ] ?? [];
$options = array_map( function( $collection ) use ( $filter_key, $existing_filters ) {
	return [
		'value' => $collection->id,
		'label' => $collection->name,
		'href' => add_query_arg($filter_key, array_merge([$collection->id], $existing_filters)),
		'checked' => in_array( $collection->id, $_GET[ $filter_key ] ?? [] ),
	];
}, $product_collections ?? [] );

// this is needed for server side rendering.
wp_interactivity_state('surecart/dropdown', [
	'label' => esc_html__('Filter', 'surecart'),
]);

// return the view.
return 'file:./view.php';

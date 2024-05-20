<?php
use SureCart\Models\ProductCollection;

$block_id = (int) $block->context["surecart/product-list/blockId"] ?? '';
$filter_key = isset( $block_id ) ? 'products-' . $block_id . '-filter' : 'products-filter';
$pagination_key = isset( $block_id ) ? 'products-' . $block_id . '-page' : 'products-page';
$filter = empty( $_GET[ $filter_key ] ) ? '' : array_map('sanitize_text_field', $_GET[ $filter_key ]);

// no filters.
if ( empty( $filter ) ) {
    return;
}

// get the collections.
$product_collections  = ProductCollection::where([
    'ids' => $filter,
])->get( array( 'per_page' => -1 ) );

// map the collections to the view.
$product_collections = array_map(function($collection) use ($filter_key, $filter, $pagination_key) {
	// remove the current collection from the filter
	$filters = array_values( array_filter( $filter, function( $id ) use ( $collection,  ) {
		return $id !== $collection->id;
	} ) );
	return [
		'href' => remove_query_arg($pagination_key, add_query_arg( $filter_key, $filters )),
		'name' => $collection->name,
		'id'  => $collection->id,
	];
}, $product_collections ?? [] );

if (empty($product_collections)) {
	return;
}

?>
<div
    <?php echo get_block_wrapper_attributes(); ?>
    <?php echo wp_interactivity_data_wp_context(['collections' => $product_collections]); ?>
>
	<template
		data-wp-each--collection="context.collections"
		data-wp-key="context.collection.id"
    >
		<span>
        	<?php echo $content ?>
		</span>
	</template>
</div>

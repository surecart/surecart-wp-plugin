<?php
use SureCart\Models\ProductCollection;

$block_id = (int) $block->context["surecart/product-list/blockId"] ?? '';
$filter_key = isset( $block_id ) ? 'products-' . $block_id . '-filter' : 'products-filter';
$filter = empty( $_GET[ $filter_key ] ) ? '' : array_map('sanitize_text_field', $_GET[ $filter_key ]);

if ( empty( $filter ) ) {
    return;
}

$product_collections  = ProductCollection::where([
    'ids' => $filter,
])->get( array( 'per_page' => -1 ) );

$product_collections = array_map(function($i) use ($product_collections, $filter_key, $filter) {
    if ( empty ( $product_collections[$i] ) ) {
        return;
    }
	return [
		'href' => esc_url( add_query_arg( $filter_key, array_diff( $filter, [ $product_collections[$i]->id ] ) ) ),
		'name' => $product_collections[$i]->name,
		'id'  => $product_collections[$i]->id,
	];
}, range(0, count($product_collections) - 1));

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

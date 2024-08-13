<?php
global $sc_query_id;
$params   = \SureCart::block()->urlParams( 'products' );
$filter   = $params->getArg( 'sc_collection' );

// no filters, don't render this block.
if ( empty( $filter ) ) {
	return;
}

$product_collections = get_terms(
	[
		'taxonomy'   => 'sc_collection',
		'hide_empty' => false,
		'include'    => $filter,
	]
);

// map the collections to the view.
$product_collections = array_map(
	function ( $collection ) use ( $params ) {
		return [
			'href' => $params->removeFilterArg( 'sc_collection', $collection->term_id ),
			'name' => $collection->name,
			'id'   => $collection->term_id,
		];
	},
	$product_collections ?? []
);

// no collections, don't render this block.
if ( empty( $product_collections ) ) {
	return;
}

?>
<div
	<?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
	<?php echo wp_kses_data( wp_interactivity_data_wp_context( [ 'collections' => $product_collections ] ) ); ?>
>
	<template
		data-wp-each--collection="context.collections"
		data-wp-each-key="context.collection.id"
	>
		<span>
			<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		</span>
	</template>
</div>

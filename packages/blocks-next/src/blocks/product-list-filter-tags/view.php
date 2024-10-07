<?php
global $sc_query_id;
$params         = \SureCart::block()->urlParams( 'products' );
$all_taxonomies = $params->getAllTaxonomyArgs();

// no filters, don't render this block.
if ( empty( $all_taxonomies ) ) {
	return;
}

$product_terms = array();
foreach ( $all_taxonomies as $taxonomy_name => $term_slugs ) {
	$terms = get_terms(
		[
			'taxonomy'   => $taxonomy_name,
			'hide_empty' => false,
			'slug'       => $term_slugs,
		]
	);

	if ( ! is_wp_error( $terms ) && ! empty( $terms ) ) {
		$product_terms = array_merge( $product_terms, $terms );
	}
}

// map the collections to the view.
$product_terms = array_map(
	function ( $term ) use ( $params ) {
		return [
			'href' => $params->removeFilterArg( $term->taxonomy, $term->slug ),
			'name' => $term->name,
			'id'   => $term->slug,
		];
	},
	$product_terms ?? []
);

// no collections, don't render this block.
if ( empty( $product_terms ) ) {
	return;
}

?>
<div
	<?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
	<?php echo wp_kses_data( wp_interactivity_data_wp_context( [ 'collections' => $product_terms ] ) ); ?>
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

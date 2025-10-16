<?php
global $sc_query_id;
$params         = \SureCart::block()->urlParams( 'products' );
$all_taxonomies = $params->getAllTaxonomyArgs();

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

return 'file:/view.php';

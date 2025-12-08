<?php

/**
 * Get SureCart query variables that should trigger noindex.
 *
 * @return array List of query variable names.
 */
function sc_get_noindex_query_vars(): array {
	$query_vars = [
		'products-sc_collection',
		'products-search',
		'products-order',
		'products-orderby',
		'line_items',
		'currency',
	];

	// Add all registered taxonomies for sc_product.
	$product_taxonomies = get_object_taxonomies( 'sc_product', 'names' );
	if ( ! empty( $product_taxonomies ) ) {
		foreach ( $product_taxonomies as $taxonomy ) {
			$query_vars[] = 'products-' . $taxonomy;
		}
	}

	/**
	 * Filter the query variables that should trigger noindex in SEO plugins.
	 *
	 * @param array $query_vars Array of query variable names.
	 */
	return apply_filters( 'surecart/noindex_query_vars', $query_vars );
}

/**
 * Check if the current request has any SureCart query variables.
 *
 * @param array $query_vars Optional. Specific query vars to check. Defaults to all noindex query vars.
 *
 * @return bool True if any SureCart query var is present.
 */
function sc_has_no_index_query_vars( array $query_vars = [] ): bool {
	if ( empty( $query_vars ) ) {
		$query_vars = sc_get_noindex_query_vars();
	}

	foreach ( $query_vars as $query_var ) {
		// Check in $_GET for query parameters.
		if ( isset( $_GET[ $query_var ] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			return true;
		}

		// Check in WP_Query.
		if ( get_query_var( $query_var ) ) {
			return true;
		}
	}

	return false;
}

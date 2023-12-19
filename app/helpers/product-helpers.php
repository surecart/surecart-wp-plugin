<?php

use SureCart\Models\Posts\Product;

if ( ! function_exists( 'sc_get_product' ) ) {
	/**
	 * Get the product.
	 *
	 * @param \WP_Post|int $product The product.
	 */
	function sc_get_product( $product = false ) {
		global $post;
		if ( empty( $product ) ) {
			$product = $post;
		}
		return new Product( $product );
	}
}

if ( ! function_exists( 'sc_get_products' ) ) {
	/**
	 * Standard way of retrieving products based on certain parameters.
	 *
	 * This function should be used for product retrieval so that we have a data agnostic
	 * way to get a list of products.
	 *
	 * @param  array $args Array of args (above).
	 * @return array|stdClass Number of pages and an array of product objects if
	 */
	function sc_get_products( $args = [] ) {
		return Product::get( $args );
	}
}

if ( ! function_exists( 'sc_query_products' ) ) {
	/**
	 * Standard way of retrieving products based on certain parameters.
	 *
	 * This function should be used for product retrieval so that we have a data agnostic
	 * way to query a list of products.
	 *
	 * @param  array $args Array of args (above).
	 * @return \WP_Query The query.
	 */
	function sc_query_products( $args ) {
		return Product::query( $args );
	}
}

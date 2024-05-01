<?php

use SureCart\Models\Product;

if ( ! function_exists( 'sc_get_product' ) ) {
	/**
	 * Get the product.
	 *
	 * @param \WP_Post|int $post The product post
	 */
	function sc_get_product( $post = false ) {
		// make sure to get the post.
		$post = get_post( $post );

		// return the post object.
		return get_post_meta( $post->ID, 'product', true );
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
		return get_posts(
			$args,
			[
				'post_type'   => 'sc_product',
				'post_status' => 'publish',
			]
		);
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
	function sc_query_products( $args = [] ) {
		return new \WP_Query(
			[
				$args,
				[
					'post_type'   => 'sc_product',
					'post_status' => 'publish',
				],
			]
		);
	}
}

/**
 * Set global $sc_product.
 *
 * @param mixed $post Post Object.
 * @return WC_Product
 */
function sc_setup_product_data( $post ) {
	return \SureCart::productPost()->setupData( $post );
}

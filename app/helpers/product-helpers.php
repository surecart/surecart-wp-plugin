<?php

use SureCart\Models\Product;

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

		// make sure to get the post.
		$product = get_post( $product );

		// return the product object.
		return new Product( get_post_meta( $product->ID, 'product', true ) );
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

<?php


if ( ! function_exists( 'sc_get_product' ) ) {
	/**
	 * Get the product.
	 *
	 * @param \WP_Post|int $post The product post.
	 *
	 * @return \SureCart\Models\Product|null
	 */
	function sc_get_product( $post = false ) {
		// make sure to get the post.
		$post = get_post( $post );

		// return the post object.
		return ! empty( $post ) ? get_post_meta( $post->ID, 'product', true ) : null;
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

if ( ! function_exists( 'sc_setup_product_data' ) ) {
	/**
	 * Set global $sc_product.
	 *
	 * @param mixed $post Post Object or ID.
	 *
	 * @return \SureCart\Models\Product
	 */
	function sc_setup_product_data( $post = '' ) {
		return \SureCart::productPost()->setupData( $post );
	}
}


if ( ! function_exists( 'sc_get_product_image' ) ) {
	/**
	 * Set global $sc_product.
	 *
	 * @param mixed  $id The attachment id.
	 * @param string $size Image size.
	 *
	 * @return string
	 */
	function sc_get_product_image( $id, $size = 'full' ) {
		$sc_product = sc_setup_product_data();
		if ( empty( $sc_product ) ) {
			return '';
		}
		return $sc_product->getImageMarkup( $id, $size );
	}
}


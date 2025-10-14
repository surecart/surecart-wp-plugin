<?php

use SureCart\Models\Blocks\ProductReviewListBlock;

if ( ! function_exists( 'sc_product_review_list_query' ) ) {
	/**
	 * Get the product review list query.
	 *
	 * @param \WP_Block $block The block.
	 * @param string    $product_id The product ID.
	 *
	 * @return \WP_Query
	 */
	function sc_product_review_list_query( $block, $product_id ) {
		// we are handling regular product list queries here.
		$controller = new ProductReviewListBlock( $block, $product_id );
		return $controller->query();
	}
}

<?php

use SureCart\Models\Blocks\ProductReviewListBlock;

if ( ! function_exists( 'sc_product_review_list_query' ) ) {
	/**
	 * Get the product review list query.
	 *
	 * @param \WP_Block $block The block.
	 *
	 * @return \WP_Query
	 */
	function sc_product_review_list_query( $block ) {
		// we are handling regular product list queries here.
		$controller = new ProductReviewListBlock( $block );
		return $controller->query();
	}
}

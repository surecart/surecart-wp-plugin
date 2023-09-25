<?php

namespace SureCartBlocks\Blocks;

/**
 * Product Block
 */
abstract class ProductBlock extends BaseBlock {
	/**
	 * Get the product id
	 *
	 * @param array $attributes Array of block attributes.
	 *
	 * @return string
	 */
	public function getProductId( $attributes ) {
		return ! empty( $attributes['product_id'] ) ? $attributes['product_id'] : get_query_var( 'surecart_current_product' )->id;
	}

	/**
	 * Get the product
	 *
	 * @param array $attributes Array of block attributes.
	 *
	 * @return Product
	 */
	public function getProduct( $attributes ) {
		if ( empty( $attributes['product_id'] ) ) {
			return get_query_var( 'surecart_current_product' );
		}

		return \SureCart\Models\Product::with( [ 'image', 'prices', 'product_medias', 'product_media.media', 'product_collections' ] )->find( $attributes['product_id'] );
	}
}

<?php

namespace SureCartBlocks\Blocks;

use SureCart\Models\Product;

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
	public function getProductId( array $attributes ): string {
		return $attributes['product_id'] ?? get_query_var( 'surecart_current_product' )->id ?? '';
	}

	/**
	 * Get the product
	 *
	 * @param array $attributes Array of block attributes.
	 *
	 * @return Product|null
	 */
	public function getProduct( array $attributes ): ?Product {
		if ( empty( $attributes['product_id'] ) ) {
			return get_query_var( 'surecart_current_product' );
		}

		return Product::with( [ 'image', 'prices', 'product_medias', 'product_media.media', 'product_collections' ] )->find( $attributes['product_id'] );
	}
}

<?php

namespace SureCartBlocks\Blocks\Product;

use SureCart\Models\Form;
use SureCart\Models\Product;
use SureCartBlocks\Blocks\BaseBlock;

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
		if ( ! empty( $attributes['product_id'] ) ) {
			$product = Product::with( [ 'image', 'prices', 'product_medias', 'variant_options', 'variants', 'product_media.media', 'product_collections' ] )->find( $attributes['product_id'] );
			$this->setInitialProductState( $product );
			return $attributes['product_id'];
		}

		return get_query_var( 'surecart_current_product' )->id ?? '';
	}

	/**
	 * Set initial product state
	 *
	 * @param Product $product The current product.
	 *
	 * @return void
	 */
	public function setInitialProductState( $product ) {
		if ( empty( $product->id ) ) {
			return;
		}

		$product_state[ $product->id ] = $product->productPageInitialState();

		sc_initial_state(
			[
				'product' => $product_state,
			]
		);
	}

	/**
	 * Get the product
	 *
	 * @param array $attributes Array of block attributes.
	 *
	 * @return Product|null
	 */
	public function getProduct( array $attributes ) {
		if ( empty( $attributes['product_id'] ) ) {
			return get_query_var( 'surecart_current_product' );
		}

		$product = Product::with( [ 'image', 'prices', 'product_medias', 'variant_options', 'variants', 'product_media.media', 'product_collections' ] )->find( $attributes['product_id'] );

		$this->setInitialProductState( $product );
		return ! empty( $product->id ) ? $product : null;
	}
}

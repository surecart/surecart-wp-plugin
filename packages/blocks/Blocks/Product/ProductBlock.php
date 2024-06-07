<?php

namespace SureCartBlocks\Blocks\Product;

use SureCart\Models\Product;
use SureCartBlocks\Blocks\BaseBlock;

/**
 * Product Block
 */
abstract class ProductBlock extends BaseBlock {
	/**
	 * Set initial product state
	 *
	 * @param Product $product The current product.
	 *
	 * @return void
	 */
	public function setInitialState( $product ) {
		if ( empty( $product->id ) ) {
			return;
		}

		$state = sc_initial_state();

		// we already have state for this product.
		if ( ! empty( $state['product'][ $product->id ] ) ) {
			return;
		}

		$product_state[ $product->id ] = $product->getInitialPageState();

		sc_initial_state(
			[
				'product' => $product_state,
			]
		);
	}

	/**
	 * Get product and call set state.
	 *
	 * @param string $id The product id.
	 *
	 * @return \SureCart\Models\Product|null
	 */
	public function getProductAndSetInitialState( $id ) {
		$product = sc_get_product( $id );

		if ( empty( $product ) ) {
			return;
		}

		$this->setInitialState( $product );

		return $product;
	}
}

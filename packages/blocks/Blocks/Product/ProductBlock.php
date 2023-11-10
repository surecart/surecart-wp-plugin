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
		return $attributes['product_id'] ?? get_query_var( 'surecart_current_product' )->id ?? '';
	}

	/**
	 * Get selected price
	 *
	 * @param array $prices
	 *
	 * @return object|null
	 */
	private function getSelectedPrice( $prices ) {
		usort(
			$prices,
			function( $a, $b ) {
				return $a['position'] - $b['position'];
			}
		);

		$selected_price_index = array_search( false, array_column( $prices, 'archived' ) );

		return $prices[ $selected_price_index ] ?? null;
	}

	/**
	 * Get selected variant
	 *
	 * @param array   $variants
	 * @param Product $product
	 *
	 * @return object|null
	 */
	private function getSelectedVariant( $variants, $product ) {
		if ( empty( $variants ) ) {
			return null;
		}

		if ( ! $product->stock_enabled || $product->allow_out_of_stock_purchases ) {
			return $variants[0];
		}

		foreach ( $variants as $variant ) {
			if ( $variant['stock'] > 0 ) {
				return $variant;
			}
		}

		return null;
	}

	public function setInitialProductState( $product ) {
		$form             = \SureCart::forms()->getDefault();
		$prices           = $product->prices->data ?? [];
		$selected_price   = $this->getSelectedPrice( $prices );
		$add_hoc_amount   = $selectedPrice['add_hoc_amount'] ?? null;
		$variant_options  = $product->variant_options->data ?? [];
		$variants         = $product->variants->data ?? [];
		$selected_variant = $this->getSelectedVariant( $variants, $product );

		$productState[ $product->id ] = array(
			'formId'          => $form->ID,
			'mode'            => Form::getMode( $form->ID ),
			'product'         => $product,
			'prices'          => $product->prices->data ?? [],
			'quantity'        => 1,
			'selectedPrice'   => $selected_price,
			'total'           => null,
			'dialog'          => null,
			'busy'            => false,
			'disabled'        => $selected_price['archived'] ?? false,
			'addHocAmount'    => $add_hoc_amount,
			'error'           => null,
			'checkoutUrl'     => '',
			'line_item'       => array(
				'price_id' => $selected_price['id'] ?? null,
				'quantity' => 1,
			),
			'variant_options' => $variant_options,
			'variants'        => $variants,
			'selectedVariant' => $selected_variant,
			'variantValues'   => [
				'option_1' => $selected_variant['option_1'] ?? null,
				'option_2' => $selected_variant['option_2'] ?? null,
				'option_3' => $selected_variant['option_3'] ?? null,
			],
		);

		if ( $selected_price->ad_hoc ) {
			$productState[ $product->id ]['line_item']['ad_hoc_amount'] = $add_hoc_amount;
		}

		$productState[ $product->id ]['variantValues'] = array_filter(
			$productState[ $product->id ]['variantValues'],
			function( $value ) {
				return ! empty( $value );
			}
		);

		sc_initial_state(
			[
				'product' => $productState,
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
	public function getProduct( array $attributes ): ?Product {
		if ( empty( $attributes['product_id'] ) ) {
			return get_query_var( 'surecart_current_product' );
		}

		$product = Product::with( [ 'image', 'prices', 'product_medias', 'variant_options', 'variants', 'product_media.media', 'product_collections' ] )->find( $attributes['product_id'] );
		$this->setInitialProductState( $product );
		return $product;
	}
}

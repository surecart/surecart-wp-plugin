<?php

namespace SureCart\Support;

use SureCart\Concerns\StripsPrivateCatalogFields;

/**
 * Strips private catalog data from models serialized into public page HTML.
 *
 * Component data scripts and the initial state store (`#sc-store-data`)
 * serialize full catalog models into storefront and checkout pages for
 * anonymous visitors. Every one of those serializations must go through this
 * class so it carries the same protection as the anonymous catalog REST
 * endpoints, instead of each call site remembering to strip.
 *
 * Use the `sc_public_product_data` / `sc_public_price_data` /
 * `sc_public_variant_data` helpers from views and blocks.
 */
class PublicCatalogData {
	use StripsPrivateCatalogFields;

	/**
	 * Fields the storefront renders from, kept at this boundary only.
	 *
	 * - available_stock: sold-out gates, in-stock variant selection and
	 *   quantity caps (sc-product-quantity, sc-line-items, the price/variant
	 *   selectors and the bundle component picker).
	 * - purchase_limit: quantity caps (getMaxStockQuantity).
	 * - archived: render gates (sc-price-choice, product store getters).
	 *
	 * The REST providers keep stripping these — the storefront renders stock
	 * state server-side, the anonymous REST catalog does not need to.
	 *
	 * @return array
	 */
	protected function preservedCatalogFields() {
		return array(
			'product' => array( 'available_stock', 'purchase_limit', 'archived' ),
			'variant' => array( 'available_stock' ),
		);
	}

	/**
	 * Get product data safe to serialize into public page HTML.
	 *
	 * @param \SureCart\Models\Product|array|object|null $product The product model or its array/object form.
	 *
	 * @return array|mixed The stripped product array. Non-object/array input passes through untouched.
	 */
	public function product( $product ) {
		return $this->stripPrivateProductFields( $this->toDataArray( $product ) );
	}

	/**
	 * Get price data safe to serialize into public page HTML.
	 *
	 * Also strips an expanded product on the price.
	 *
	 * @param \SureCart\Models\Price|array|object|null $price The price model or its array/object form.
	 *
	 * @return array|mixed The stripped price array. Non-object/array input passes through untouched.
	 */
	public function price( $price ) {
		return $this->stripPrivatePriceFields( $this->toDataArray( $price ) );
	}

	/**
	 * Get variant data safe to serialize into public page HTML.
	 *
	 * @param \SureCart\Models\Variant|array|object|null $variant The variant model or its array/object form.
	 *
	 * @return array|mixed The stripped variant array. Non-object/array input passes through untouched.
	 */
	public function variant( $variant ) {
		return $this->stripPrivateVariantFields( $this->toDataArray( $variant ) );
	}

	/**
	 * Get variant option data safe to serialize into public page HTML.
	 *
	 * @param \SureCart\Models\VariantOption|array|object|null $option The variant option model or its array/object form.
	 *
	 * @return array|mixed The stripped variant option array. Non-object/array input passes through untouched.
	 */
	public function variantOption( $option ) {
		return $this->stripPrivateVariantOptionFields( $this->toDataArray( $option ) );
	}

	/**
	 * Normalize a model/object to the exact array shape wp_json_encode outputs,
	 * so stripping sees what would have been serialized.
	 *
	 * @param mixed $data The data to normalize.
	 *
	 * @return array|mixed
	 */
	private function toDataArray( $data ) {
		if ( null === $data || is_scalar( $data ) ) {
			return $data;
		}

		return json_decode( wp_json_encode( $data ), true );
	}
}

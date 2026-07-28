<?php

namespace SureCart\Concerns;

/**
 * Strips private catalog data from anonymous-facing serializations — view/embed
 * REST responses in places the item schema can't reach (expanded sub-objects)
 * and catalog data serialized into public page HTML (see PublicCatalogData).
 */
trait StripsPrivateCatalogFields {
	/**
	 * Private field keys excluded from stripping, keyed by catalog object type.
	 *
	 * Empty by default so REST responses strip everything. The public HTML
	 * serializer overrides this to keep the few fields the storefront renders
	 * from — see \SureCart\Support\PublicCatalogData for the list and reasons.
	 *
	 * @return array
	 */
	protected function preservedCatalogFields() {
		return array();
	}

	/**
	 * Strip the given private fields from a catalog response array.
	 *
	 * @param array  $data   Response data.
	 * @param array  $fields Default field keys to strip.
	 * @param string $type   Catalog object type the fields belong to.
	 *
	 * @return array
	 */
	private function stripPrivateFields( $data, $fields, $type ) {
		$preserved = $this->preservedCatalogFields()[ $type ] ?? array();
		if ( ! empty( $preserved ) ) {
			$fields = array_diff( $fields, $preserved );
		}

		/**
		 * Filters the private field keys stripped from view/embed catalog
		 * REST responses.
		 *
		 * WARNING: this is a security control. These endpoints proxy the
		 * private platform API with the store's secret token — removing a
		 * key from this list re-exposes private platform data (stock, skus,
		 * metadata, offer internals, customer PII) to anonymous callers.
		 *
		 * @param array  $fields Field keys stripped from the response.
		 * @param string $type   Catalog object type (product, variant, variant_option, price, review, product_collection, bundle_item).
		 * @param array  $data   The response data being stripped.
		 */
		$fields = apply_filters( 'surecart/rest/private_catalog_fields', $fields, $type, $data );

		foreach ( (array) $fields as $field ) {
			unset( $data[ $field ] );
		}

		return $data;
	}

	/**
	 * Strip private fields from a product array.
	 *
	 * Covers fields the products schema strips at the top level, so it can
	 * also be applied to products expanded on other resources (e.g. prices).
	 *
	 * @param array|mixed $product Product response data. Non-arrays pass through untouched.
	 *
	 * @return array|mixed
	 */
	protected function stripPrivateProductFields( $product ) {
		if ( ! is_array( $product ) ) {
			return $product;
		}

		$product = $this->stripPrivateFields(
			$product,
			[
				// private sub-objects — never for anonymous callers.
				'commission_structure',
				'downloads',
				'current_release_download',
				'files',
				'shipping_profile',
				// internals the schema strips on the products endpoint.
				// metrics stays — the product list renders price ranges from it.
				'available_stock',
				'held_stock',
				'stock',
				'status',
				'archived',
				'archived_at',
				'discarded_at',
				'cataloged_at',
				'sku',
				'metadata',
				'dimensions',
				'weight',
				'weight_unit',
				'tax_category',
				'tax_enabled',
				'purchase_limit',
			],
			'product'
		);

		if ( ! empty( $product['variants']['data'] ) && is_array( $product['variants']['data'] ) ) {
			$product['variants']['data'] = array_map( [ $this, 'stripPrivateVariantFields' ], $product['variants']['data'] );
		}

		if ( ! empty( $product['variant_options']['data'] ) && is_array( $product['variant_options']['data'] ) ) {
			$product['variant_options']['data'] = array_map( [ $this, 'stripPrivateVariantOptionFields' ], $product['variant_options']['data'] );
		}

		if ( ! empty( $product['prices']['data'] ) && is_array( $product['prices']['data'] ) ) {
			$product['prices']['data'] = array_map( [ $this, 'stripPrivatePriceFields' ], $product['prices']['data'] );
		}

		if ( ! empty( $product['reviews']['data'] ) && is_array( $product['reviews']['data'] ) ) {
			$product['reviews']['data'] = array_map( [ $this, 'stripPrivateReviewFields' ], $product['reviews']['data'] );
		}

		if ( ! empty( $product['product_collections']['data'] ) && is_array( $product['product_collections']['data'] ) ) {
			$product['product_collections']['data'] = array_map( [ $this, 'stripPrivateCollectionFields' ], $product['product_collections']['data'] );
		}

		if ( ! empty( $product['bundle_items']['data'] ) && is_array( $product['bundle_items']['data'] ) ) {
			$product['bundle_items']['data'] = array_map( [ $this, 'stripPrivateBundleItemFields' ], $product['bundle_items']['data'] );
		}

		// accessor-derived copies (Model::toArray appends every get*Attribute) leak the same fields.
		foreach ( [ 'active_prices', 'active_ad_hoc_prices' ] as $key ) {
			if ( ! empty( $product[ $key ] ) && is_array( $product[ $key ] ) ) {
				$product[ $key ] = array_map( [ $this, 'stripPrivatePriceFields' ], $product[ $key ] );
			}
		}

		if ( ! empty( $product['in_stock_variants'] ) && is_array( $product['in_stock_variants'] ) ) {
			$product['in_stock_variants'] = array_map( [ $this, 'stripPrivateVariantFields' ], $product['in_stock_variants'] );
		}

		if ( ! empty( $product['initial_price'] ) ) {
			$product['initial_price'] = $this->stripPrivatePriceFields( $product['initial_price'] );
		}

		foreach ( [ 'initial_variant', 'first_variant_with_stock' ] as $key ) {
			if ( ! empty( $product[ $key ] ) ) {
				$product[ $key ] = $this->stripPrivateVariantFields( $product[ $key ] );
			}
		}

		return $product;
	}

	/**
	 * Strip private fields from a variant array.
	 *
	 * @param array|mixed $variant Variant response data. Non-arrays pass through untouched.
	 *
	 * @return array|mixed
	 */
	protected function stripPrivateVariantFields( $variant ) {
		if ( ! is_array( $variant ) ) {
			return $variant;
		}

		return $this->stripPrivateFields(
			$variant,
			[
				'available_stock',
				'held_stock',
				'stock',
				'sku',
				'metadata',
				'dimensions',
				'weight',
				'weight_unit',
				// signed download urls — never for anonymous callers.
				'downloads',
				'current_release_download',
			],
			'variant'
		);
	}

	/**
	 * Strip private fields from a variant option array.
	 *
	 * Variant options ride along on products and bundle items
	 * (variant_options / component_variant_options) and carry metadata.
	 *
	 * @param array|mixed $option Variant option response data. Non-arrays pass through untouched.
	 *
	 * @return array|mixed
	 */
	protected function stripPrivateVariantOptionFields( $option ) {
		if ( ! is_array( $option ) ) {
			return $option;
		}

		return $this->stripPrivateFields(
			$option,
			[
				'metadata',
			],
			'variant_option'
		);
	}

	/**
	 * Strip private fields from a bundle item array.
	 *
	 * A bundle item expands the component product (and its variants) the
	 * bundle checkout renders — the nested product carries the same private
	 * fields as a top-level one, so it gets the same treatment.
	 *
	 * @param array|mixed $item Bundle item response data. Non-arrays pass through untouched.
	 *
	 * @return array|mixed
	 */
	protected function stripPrivateBundleItemFields( $item ) {
		if ( ! is_array( $item ) ) {
			return $item;
		}

		$item = $this->stripPrivateFields(
			$item,
			[
				'metadata',
			],
			'bundle_item'
		);

		foreach ( [ 'component_product', 'bundle_product' ] as $key ) {
			if ( ! empty( $item[ $key ] ) && is_array( $item[ $key ] ) ) {
				$item[ $key ] = $this->stripPrivateProductFields( $item[ $key ] );
			}
		}

		if ( ! empty( $item['component_variants']['data'] ) && is_array( $item['component_variants']['data'] ) ) {
			$item['component_variants']['data'] = array_map( [ $this, 'stripPrivateVariantFields' ], $item['component_variants']['data'] );
		}

		if ( ! empty( $item['component_variant_options']['data'] ) && is_array( $item['component_variant_options']['data'] ) ) {
			$item['component_variant_options']['data'] = array_map( [ $this, 'stripPrivateVariantOptionFields' ], $item['component_variant_options']['data'] );
		}

		return $item;
	}

	/**
	 * Strip private fields from a price array.
	 *
	 * Keeps scratch_amount — the storefront renders it as the compare-at price.
	 *
	 * @param array|mixed $price Price response data. Non-arrays pass through untouched.
	 *
	 * @return array|mixed
	 */
	protected function stripPrivatePriceFields( $price ) {
		if ( ! is_array( $price ) ) {
			return $price;
		}

		$price = $this->stripPrivateFields(
			$price,
			[
				'metadata',
				'archived_at',
				'discarded_at',
			],
			'price'
		);

		// a price can expand its product — it carries the same private fields.
		if ( ! empty( $price['product'] ) && is_array( $price['product'] ) ) {
			$price['product'] = $this->stripPrivateProductFields( $price['product'] );
		}

		return $price;
	}

	/**
	 * Strip customer PII and purchase internals from a review array.
	 *
	 * @param array|mixed $review Review response data. Non-arrays pass through untouched.
	 *
	 * @return array|mixed
	 */
	protected function stripPrivateReviewFields( $review ) {
		if ( ! is_array( $review ) ) {
			return $review;
		}

		return $this->stripPrivateFields(
			$review,
			[
				'customer',
				'purchase',
			],
			'review'
		);
	}

	/**
	 * Strip private fields from a product collection array.
	 *
	 * Covers the fields the collections schema makes edit-only, so it can
	 * also be applied to collections expanded on products.
	 *
	 * @param array|mixed $collection Product collection response data. Non-arrays pass through untouched.
	 *
	 * @return array|mixed
	 */
	protected function stripPrivateCollectionFields( $collection ) {
		if ( ! is_array( $collection ) ) {
			return $collection;
		}

		return $this->stripPrivateFields(
			$collection,
			[
				'metadata',
				'archived_at',
			],
			'product_collection'
		);
	}
}

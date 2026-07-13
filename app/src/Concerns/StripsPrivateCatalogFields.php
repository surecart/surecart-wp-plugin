<?php

namespace SureCart\Concerns;

/**
 * Strips private catalog data from view/embed REST responses in places
 * the item schema can't reach — expanded sub-objects.
 */
trait StripsPrivateCatalogFields {
	/**
	 * Strip private fields from a product array.
	 *
	 * Covers fields the products schema strips at the top level, so it can
	 * also be applied to products expanded on other resources (e.g. prices).
	 *
	 * @param array $product Product response data.
	 *
	 * @return array
	 */
	protected function stripPrivateProductFields( $product ) {
		if ( ! is_array( $product ) ) {
			return $product;
		}

		unset(
			// private sub-objects — never for anonymous callers.
			$product['commission_structure'],
			$product['downloads'],
			$product['current_release_download'],
			$product['files'],
			$product['shipping_profile'],
			// internals the schema strips on the products endpoint.
			// metrics stays — the product list renders price ranges from it.
			$product['available_stock'],
			$product['held_stock'],
			$product['stock'],
			$product['status'],
			$product['archived'],
			$product['archived_at'],
			$product['discarded_at'],
			$product['cataloged_at'],
			$product['sku'],
			$product['metadata'],
			$product['dimensions'],
			$product['weight'],
			$product['weight_unit'],
			$product['tax_category'],
			$product['tax_enabled'],
			$product['purchase_limit']
		);

		if ( ! empty( $product['variants']['data'] ) && is_array( $product['variants']['data'] ) ) {
			$product['variants']['data'] = array_map( [ $this, 'stripPrivateVariantFields' ], $product['variants']['data'] );
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
	 * @param array $variant Variant response data.
	 *
	 * @return array
	 */
	protected function stripPrivateVariantFields( $variant ) {
		if ( ! is_array( $variant ) ) {
			return $variant;
		}

		unset(
			$variant['available_stock'],
			$variant['held_stock'],
			$variant['stock'],
			$variant['sku'],
			$variant['metadata'],
			$variant['dimensions'],
			$variant['weight'],
			$variant['weight_unit'],
			// signed download urls — never for anonymous callers.
			$variant['downloads'],
			$variant['current_release_download']
		);

		return $variant;
	}

	/**
	 * Strip private fields from a price array.
	 *
	 * Keeps scratch_amount — the storefront renders it as the compare-at price.
	 *
	 * @param array $price Price response data.
	 *
	 * @return array
	 */
	protected function stripPrivatePriceFields( $price ) {
		if ( ! is_array( $price ) ) {
			return $price;
		}

		unset(
			$price['metadata'],
			$price['archived_at'],
			$price['discarded_at']
		);

		return $price;
	}

	/**
	 * Strip customer PII and purchase internals from a review array.
	 *
	 * @param array $review Review response data.
	 *
	 * @return array
	 */
	protected function stripPrivateReviewFields( $review ) {
		if ( ! is_array( $review ) ) {
			return $review;
		}

		unset(
			$review['customer'],
			$review['purchase']
		);

		return $review;
	}

	/**
	 * Strip private fields from a product collection array.
	 *
	 * Covers the fields the collections schema makes edit-only, so it can
	 * also be applied to collections expanded on products.
	 *
	 * @param array $collection Product collection response data.
	 *
	 * @return array
	 */
	protected function stripPrivateCollectionFields( $collection ) {
		if ( ! is_array( $collection ) ) {
			return $collection;
		}

		unset(
			$collection['metadata'],
			$collection['archived_at']
		);

		return $collection;
	}
}

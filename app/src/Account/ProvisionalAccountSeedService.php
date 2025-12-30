<?php

namespace SureCart\Account;

use SureCart\Models\ProductCollectionImport;
use SureCart\Models\ProductImport;

/**
 * Service for seeding provisional accounts with products and collections.
 */
class ProvisionalAccountSeedService {
	/**
	 * Seed the account with products and collections.
	 *
	 * @param array $products The products to seed.
	 *
	 * @return \SureCart\Models\Import|\WP_Error
	 */
	public function seed( $products = [] ) {
		[ $collections, $products ] = $this->extractCollections( $products );

		// Import collections first if any exist.
		if ( ! empty( $collections ) ) {
			$collection_import = ( new ProductCollectionImport() )->create(
				[ 'data' => $collections ]
			);
			if ( is_wp_error( $collection_import ) ) {
				return $collection_import;
			}
		}

		// Import products.
		return ( new ProductImport() )->create( [ 'data' => $products ] );
	}

	/**
	 * Extract collections from products and add collection slugs directly to products.
	 *
	 * @param array $products The products array.
	 *
	 * @return array Array with two elements: [0] collections array, [1] products array.
	 */
	public function extractCollections( $products ) {
		$collections = [];

		// Loop through the products.
		foreach ( $products as $key => $product ) {
			// If there are no collections, skip.
			if ( empty( $product['product_collections'] ) ) {
				continue;
			}

			// Loop through the collections.
			$slugs = [];
			foreach ( $product['product_collections'] as $collection ) {
				$slug                 = $collection['slug'];
				$collections[ $slug ] = $collection;
				$slugs[]              = $slug;
			}

			// Replace product_collections with just the slugs.
			$products[ $key ]['product_collection_slugs'] = $slugs;

			// Remove the product_collections from the product.
			unset( $products[ $key ]['product_collections'] );
		}

		return [
			array_values( $collections ), // Return the collections as an array of values.
			array_values( $products ),    // Return the products as an array of values.
		];
	}
}

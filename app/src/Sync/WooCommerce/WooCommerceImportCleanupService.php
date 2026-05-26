<?php

namespace SureCart\Sync\WooCommerce;

use SureCart\Models\Product;

/**
 * Cleans up WooCommerce import meta when a SureCart product is deleted,
 * allowing the WC product to be re-imported.
 */
class WooCommerceImportCleanupService {
	/**
	 * Bootstrap the service by hooking into product deletion.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_action( 'surecart/product_deleted', [ $this, 'handleProductDeleted' ] );
	}

	/**
	 * When a SureCart product is deleted, clear the import flag
	 * on the corresponding WooCommerce product so it can be re-imported.
	 *
	 * @param Product $product The deleted SureCart product.
	 * @return void
	 */
	public function handleProductDeleted( Product $product ) {
		if ( ! class_exists( 'WooCommerce' ) ) {
			return;
		}

		$wc_product_id = $this->getWcProductId( $product );
		if ( empty( $wc_product_id ) ) {
			return;
		}

		// Verify the WC product exists.
		if ( get_post_type( (int) $wc_product_id ) !== 'product' ) {
			return;
		}

		// Clear the import flag so the product can be re-imported.
		delete_post_meta( (int) $wc_product_id, '_surecart_imported' );

		// Invalidate cached excluded IDs used by WooCommerceImportJob.
		delete_transient( 'sc_woo_import_excluded_ids' );

		// Reset the fallback purge throttle so the next admin page load re-checks.
		delete_transient( 'sc_woo_import_purge_checked' );
	}

	/**
	 * Extract wc_product_id from the product metadata.
	 * Handles both object and array formats.
	 *
	 * @param Product $product The SureCart product.
	 * @return int|null
	 */
	protected function getWcProductId( Product $product ) {
		$metadata = $product->metadata ?? null;

		if ( empty( $metadata ) ) {
			return null;
		}

		if ( is_object( $metadata ) ) {
			return $metadata->wc_product_id ?? null;
		}

		if ( is_array( $metadata ) ) {
			return $metadata['wc_product_id'] ?? null;
		}

		return null;
	}
}

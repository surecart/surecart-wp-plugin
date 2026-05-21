<?php

namespace SureCart\Sync\WooCommerce;

use SureCart\Models\ProductImport;
use SureCart\Sync\ImportState;
use SureCart\Sync\Tasks\Task;

/**
 * Task that processes a batch of WooCommerce products for import.
 *
 * Receives an array of WC product IDs from WooCommerceImportJob,
 * maps each to SureCart format, and batch-imports via the API.
 *
 * @package SureCart
 */
class WooCommerceImportTask extends Task {

	/**
	 * The action name.
	 *
	 * @var string
	 */
	protected $action_name = 'surecart/sync/woocommerce_import';

	/**
	 * Show a notice while tasks are pending.
	 *
	 * @var boolean
	 */
	protected $show_notice = true;

	/**
	 * The product mapper.
	 *
	 * @var WooCommerceProductMapper|null
	 */
	private $mapper = null;

	/**
	 * WooCommerce import state tracker.
	 *
	 * @var ImportState
	 */
	private $import_state;

	/**
	 * Constructor.
	 *
	 * @param ImportState $import_state Import state for WooCommerce runs.
	 */
	public function __construct( ImportState $import_state ) {
		$this->import_state = $import_state;
	}

	/**
	 * Queue a batch of product IDs for processing.
	 *
	 * Overrides the base queue() to accept an array of IDs
	 * instead of a single ID.
	 *
	 * @param array $product_ids Array of WooCommerce product IDs.
	 *
	 * @return \SureCart\Queue\Async
	 */
	public function queue( $product_ids ) {
		$batch_id = wp_generate_uuid4();

		return \SureCart::queue()->async(
			$this->action_name,
			[
				'id'          => $product_ids,
				'show_notice' => $this->show_notice,
			],
			$this->action_name . '-' . $batch_id,
			true
		);
	}

	/**
	 * Handle a batch of WooCommerce product IDs.
	 *
	 * Maps each product, sends the batch to the SureCart API,
	 * and tracks results.
	 *
	 * @param array   $product_ids Array of WooCommerce product IDs.
	 * @param boolean $show_notice Whether to show a notice.
	 *
	 * @return void
	 */
	public function handle( $product_ids, $show_notice = false ) {
		if ( ! is_array( $product_ids ) || empty( $product_ids ) ) {
			return;
		}

		if ( ! class_exists( 'WooCommerce' ) ) {
			return;
		}

		$mapper                = $this->getMapper();
		$products_import_batch = [];
		$imported_product_ids  = [];
		$skipped_products      = [];

		foreach ( $product_ids as $product_id ) {
			$result = $this->processProduct( $product_id, $mapper, $skipped_products );
			if ( null !== $result ) {
				$products_import_batch[] = $result;
				$imported_product_ids[]  = $product_id;
			}
		}

		// Flush skipped products to the transient.
		$this->flushSkippedProducts( $skipped_products );

		if ( empty( $products_import_batch ) ) {
			return;
		}

		// Batch-import via API.
		$import = ( new ProductImport() )->create( [ 'data' => $products_import_batch ] );

		if ( is_wp_error( $import ) ) {
			error_log( 'SureCart WooCommerce Sync: Import failed - ' . esc_html( $import->get_error_message() ) ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log

			// Track failed batch products so they appear on the results page.
			$this->trackFailedBatch( $products_import_batch, $import->get_error_message() );
			return;
		}

		if ( ! empty( $import->id ) ) {
			// Mark products as imported only after API confirms success.
			foreach ( $imported_product_ids as $imported_id ) {
				update_post_meta( $imported_id, '_surecart_imported', time() );
			}

			$this->import_state->appendResultId( $import->id );
		}
	}

	/**
	 * Get or create the product mapper instance.
	 *
	 * @return WooCommerceProductMapper
	 */
	private function getMapper() {
		if ( null === $this->mapper ) {
			$this->mapper = new WooCommerceProductMapper();
		}
		$this->mapper->resetCaches();
		return $this->mapper;
	}

	/**
	 * Process a single WooCommerce product.
	 *
	 * @param int                      $product_id       WooCommerce Product ID.
	 * @param WooCommerceProductMapper  $mapper           The product mapper.
	 * @param array                    &$skipped_products Array to accumulate skipped products.
	 *
	 * @return array|null Mapped product data, or null if skipped/failed.
	 */
	private function processProduct( $product_id, $mapper, &$skipped_products ) {
		try {
			$product = wc_get_product( $product_id );

			if ( ! $product ) {
				$this->trackSkippedProduct( $skipped_products, null, 'invalid', 'product_not_found' );
				return null;
			}

			// Skip unsupported product types.
			$product_type = $product->get_type();
			if ( in_array( $product_type, [ 'grouped', 'external' ], true ) ) {
				$this->trackSkippedProduct( $skipped_products, $product, $product_type, 'unsupported_type' );
				return null;
			}

			// Skip variable products with >3 variation attributes (SureCart supports max 3).
			if ( $product->is_type( 'variable' ) ) {
				$variation_attribute_count = count(
					array_filter(
						$product->get_attributes(),
						function ( $attr ) {
							return $attr->get_variation();
						}
					)
				);

				if ( $variation_attribute_count > 3 ) {
					$this->trackSkippedProduct( $skipped_products, $product, $product_type, 'too_many_attributes' );
					return null;
				}
			}

			return $mapper->mapWooCommerceProductToSureCart( $product );

		} catch ( \Exception $e ) {
			error_log( sprintf( 'SureCart WooCommerce Sync: Failed to sync product %d - %s', $product_id, $e->getMessage() ) ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
			$this->trackSkippedProduct( $skipped_products, $product ?? null, isset( $product ) ? $product->get_type() : 'unknown', 'mapping_error' );
			return null;
		}
	}

	/**
	 * Track a skipped product for import results reporting.
	 *
	 * @param array            &$skipped_products Accumulated skipped products.
	 * @param \WC_Product|null $product           WooCommerce Product (null if not found).
	 * @param string           $product_type      Product type.
	 * @param string           $skip_reason       Machine-readable skip reason code.
	 *
	 * @return void
	 */
	private function trackSkippedProduct( &$skipped_products, $product, $product_type, $skip_reason ) {
		$reason_messages = [
			'unsupported_type'    => sprintf(
				/* translators: %s: product type */
				__( 'Unsupported product type: %s', 'surecart' ),
				$product_type
			),
			'product_not_found'   => __( 'Product not found in WooCommerce', 'surecart' ),
			'too_many_attributes' => __( 'Too many variation attributes (SureCart supports a maximum of 3)', 'surecart' ),
			'mapping_error'       => __( 'Failed to map product data during import', 'surecart' ),
		];

		$skipped_products[] = [
			'wc_product_id' => $product ? $product->get_id() : 0,
			'name'          => $product ? ( $product->get_name() ?? __( 'Unnamed Product', 'surecart' ) ) : __( 'Unknown Product', 'surecart' ),
			'type'          => $product_type,
			'reason'        => $reason_messages[ $skip_reason ] ?? __( 'Product skipped', 'surecart' ),
		];
	}

	/**
	 * Track all products in a failed API batch as skipped items.
	 *
	 * When the API batch call fails, none of the products in the batch
	 * are imported. This ensures they appear on the results page.
	 *
	 * @param array  $batch         Array of mapped product data sent to the API.
	 * @param string $error_message The API error message.
	 *
	 * @return void
	 */
	private function trackFailedBatch( array $batch, string $error_message ) {
		$failed_items = [];
		foreach ( $batch as $product_data ) {
			$failed_items[] = [
				'wc_product_id' => 0,
				'name'          => $product_data['name'] ?? __( 'Unknown Product', 'surecart' ),
				'type'          => 'api_error',
				'reason'        => sprintf(
					/* translators: %s: error message from the API */
					__( 'API import failed: %s', 'surecart' ),
					$error_message
				),
			];
		}
		$this->import_state->addSkippedItems( $failed_items );
	}

	/**
	 * Flush accumulated skipped products to the transient.
	 *
	 * @param array $skipped_products Array of skipped product data.
	 *
	 * @return void
	 */
	private function flushSkippedProducts( $skipped_products ) {
		// Delegate to centralized state tracker (same option/transient behavior).
		$this->import_state->addSkippedItems( $skipped_products );
	}
}

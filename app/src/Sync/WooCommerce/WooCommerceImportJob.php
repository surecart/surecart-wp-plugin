<?php

namespace SureCart\Sync\WooCommerce;

use SureCart\Background\Job;
use SureCart\Models\ProductImport;

/**
 * Background job that imports WooCommerce products into SureCart.
 *
 * Each queue item represents one page of WC products. The BackgroundProcess
 * base class handles time limits (20s), memory limits (90%), locking,
 * cron healthcheck, and pause/resume/cancel.
 *
 * @package SureCart
 */
class WooCommerceImportJob extends Job {

	/**
	 * The prefix for the action.
	 *
	 * @var string
	 */
	protected $prefix = 'surecart';

	/**
	 * The action.
	 *
	 * @var string
	 */
	protected $action = 'woo_import_products';

	/**
	 * The product mapper.
	 *
	 * @var WooCommerceProductMapper
	 */
	protected $mapper;

	/**
	 * Skipped products accumulated during the current batch.
	 *
	 * @var array
	 */
	private $skipped_products_batch = [];

	/**
	 * Product IDs successfully mapped in the current batch (meta deferred until API confirms).
	 *
	 * @var int[]
	 */
	private $imported_product_ids = [];

	/**
	 * Constructor.
	 *
	 * @param \SureCart\Sync\Tasks\Task $task The task.
	 */
	public function __construct( $task ) {
		parent::__construct( $task );
		$this->mapper = new WooCommerceProductMapper();
	}

	/**
	 * Process one page of WooCommerce products.
	 *
	 * @param mixed $args Queue item with 'page' and 'batch_size' keys.
	 *
	 * @return mixed Modified args for next page, or false when done.
	 */
	protected function task( $args ) {
		$page       = $args['page'] ?? 1;
		$batch_size = max( 1, min( 500, (int) ( $args['batch_size'] ?? 100 ) ) );

		// Reset per-batch currency cache (collections cache persists across batches).
		$this->mapper->resetCurrencyCache();
		$this->skipped_products_batch = [];
		$this->imported_product_ids   = [];

		if ( ! class_exists( 'WooCommerce' ) ) {
			return false;
		}

		// Get WooCommerce products (exclude already-imported products).
		add_filter( 'woocommerce_product_data_store_cpt_get_products_query', [ $this->mapper, 'excludeImportedProducts' ], 10, 2 );

		try {
			$products = wc_get_products(
				[
					'limit'                 => $batch_size,
					'page'                  => $page,
					'return'                => 'ids',
					'paginate'              => true,
					'surecart_not_imported' => true,
				]
			);
		} finally {
			remove_filter( 'woocommerce_product_data_store_cpt_get_products_query', [ $this->mapper, 'excludeImportedProducts' ], 10 );
		}

		// Validate wc_get_products() result in case WooCommerce was deactivated mid-sync.
		if ( ! is_object( $products ) || ! isset( $products->products, $products->max_num_pages ) ) {
			return false;
		}

		// Map each product.
		$products_import_batch = [];
		foreach ( $products->products as $product_id ) {
			$mapped = $this->processProduct( $product_id );
			if ( null !== $mapped ) {
				$products_import_batch[] = $mapped;
			}
		}

		// Flush skipped products to the transient once per batch.
		$this->flushSkippedProducts();

		// Create import batch if we have products.
		if ( ! empty( $products_import_batch ) ) {
			$import = ( new ProductImport() )->create( [ 'data' => $products_import_batch ] );

			if ( is_wp_error( $import ) ) {
				error_log( 'SureCart WooCommerce Sync: Import failed - ' . $import->get_error_message() ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
			} elseif ( ! empty( $import->id ) ) {
				// Mark products as imported only after the API confirms success.
				foreach ( $this->imported_product_ids as $imported_id ) {
					update_post_meta( $imported_id, '_surecart_imported', time() );
				}

				$this->appendImportId( $import->id );
			}
		}

		// If total pages is less than or equal to current page, we're done.
		if ( $products->max_num_pages <= $page ) {
			$this->handleCompletion();
			return false;
		}

		// Return args for the next page.
		return [
			'page'       => $page + 1,
			'batch_size' => $batch_size,
		];
	}

	/**
	 * Process a single WooCommerce product.
	 *
	 * @param int $product_id WooCommerce Product ID.
	 * @return array|null Mapped product data, or null if skipped/failed.
	 */
	private function processProduct( $product_id ) {
		try {
			$product = wc_get_product( $product_id );

			if ( ! $product ) {
				$this->trackSkippedProduct( null, 'invalid', 'product_not_found' );
				return null;
			}

			// Skip unsupported product types.
			$product_type = $product->get_type();
			if ( in_array( $product_type, [ 'grouped', 'external' ], true ) ) {
				$this->trackSkippedProduct( $product, $product_type, 'unsupported_type' );
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
					$this->trackSkippedProduct( $product, $product_type, 'too_many_attributes' );
					return null;
				}
			}

			// Map the WooCommerce Product to SureCart.
			$mapped = $this->mapper->mapWooCommerceProductToSureCart( $product );

			// Accumulate product ID -- meta is written only after API confirms success.
			$this->imported_product_ids[] = $product_id;

			return $mapped;

		} catch ( \Exception $e ) {
			error_log( sprintf( 'SureCart WooCommerce Sync: Failed to sync product %d - %s', $product_id, $e->getMessage() ) ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
			$this->trackSkippedProduct( $product ?? null, isset( $product ) ? $product->get_type() : 'unknown', 'mapping_error' );
			return null;
		}
	}

	/**
	 * Handle all-skipped edge case when job completes.
	 *
	 * @return void
	 */
	private function handleCompletion() {
		$import_ids = get_option( 'sc_woo_import_ids', [] );

		if ( empty( $import_ids ) ) {
			// No imports created - check if products were skipped.
			$session_id = get_option( 'sc_woo_import_session_id' );

			if ( $session_id ) {
				$transient_key    = 'sc_woo_import_skipped_' . $session_id;
				$skipped_products = get_transient( $transient_key );

				if ( ! empty( $skipped_products ) ) {
					// All products skipped - store session_id for results page.
					update_option( 'sc_woo_import_all_skipped', $session_id, false );
				}
			}
		}
	}

	/**
	 * Get or create import session ID for tracking skipped products.
	 *
	 * @return string Session ID (UUID).
	 */
	private function getImportSessionId() {
		$session_id = get_option( 'sc_woo_import_session_id' );
		if ( ! $session_id ) {
			$session_id = wp_generate_uuid4();
			update_option( 'sc_woo_import_session_id', $session_id, false );
		}
		return $session_id;
	}

	/**
	 * Track a skipped product for import results reporting.
	 *
	 * @param \WC_Product|null $product      WooCommerce Product (null if not found).
	 * @param string           $product_type Product type.
	 * @param string           $skip_reason  Machine-readable skip reason code.
	 * @return void
	 */
	private function trackSkippedProduct( $product, $product_type, $skip_reason ) {
		// Build human-readable skip reason message.
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

		$this->skipped_products_batch[] = [
			'wc_product_id' => $product ? $product->get_id() : 0,
			'name'          => $product ? ( $product->get_name() ?? __( 'Unnamed Product', 'surecart' ) ) : __( 'Unknown Product', 'surecart' ),
			'type'          => $product_type,
			'reason'        => $reason_messages[ $skip_reason ] ?? __( 'Product skipped', 'surecart' ),
		];
	}

	/**
	 * Attempt to acquire a lock using wp_cache_add (atomic).
	 * Falls back gracefully — wp_cache_add returns false if the key already exists.
	 *
	 * Note: On hosts without a persistent object cache (Redis/Memcached), wp_cache_add
	 * is per-request only. This is acceptable because Action Scheduler processes batches
	 * sequentially within a single process, making concurrent lock contention unlikely.
	 *
	 * @param string $lock_key   Cache key for the lock.
	 * @param int    $max_retries Maximum number of acquire attempts.
	 * @return bool Whether the lock was acquired.
	 */
	private function acquireLock( $lock_key, $max_retries = 5 ) {
		for ( $i = 0; $i < $max_retries; $i++ ) {
			// wp_cache_add is atomic — returns false if key already exists.
			if ( wp_cache_add( $lock_key, 1, '', 30 ) ) {
				return true;
			}
			usleep( 200000 ); // 200ms.
		}
		return false;
	}

	/**
	 * Release a previously acquired lock.
	 *
	 * @param string $lock_key Cache key for the lock.
	 * @return void
	 */
	private function releaseLock( $lock_key ) {
		wp_cache_delete( $lock_key );
	}

	/**
	 * Flush accumulated skipped products to the transient in a single write.
	 * Uses an atomic lock to prevent race conditions between concurrent batches.
	 *
	 * @return void
	 */
	private function flushSkippedProducts() {
		if ( empty( $this->skipped_products_batch ) ) {
			return;
		}

		$session_id    = $this->getImportSessionId();
		$transient_key = 'sc_woo_import_skipped_' . $session_id;
		$lock_key      = $transient_key . '_lock';

		$lock_acquired = $this->acquireLock( $lock_key );

		if ( ! $lock_acquired ) {
			error_log( 'SureCart WooCommerce Sync: Could not acquire lock for skipped products — falling back to direct write.' ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
		}

		// Merge with any previously stored skipped products from earlier batches.
		$skipped_products = get_transient( $transient_key );
		if ( ! is_array( $skipped_products ) ) {
			$skipped_products = [];
		}

		$skipped_products = array_merge( $skipped_products, $this->skipped_products_batch );

		// Store for 7 days (matches typical ImportRow retention).
		set_transient( $transient_key, $skipped_products, 7 * DAY_IN_SECONDS );

		if ( $lock_acquired ) {
			$this->releaseLock( $lock_key );
		}

		$this->skipped_products_batch = [];
	}

	/**
	 * Atomically append an import ID to the stored list.
	 * Uses an atomic lock to prevent race conditions between concurrent batches.
	 *
	 * @param string $import_id The import ID to append.
	 * @return void
	 */
	private function appendImportId( $import_id ) {
		$lock_key = 'sc_woo_import_ids_lock';

		$lock_acquired = $this->acquireLock( $lock_key );

		if ( ! $lock_acquired ) {
			error_log( 'SureCart WooCommerce Sync: Could not acquire lock for import IDs — falling back to direct write.' ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
		}

		$existing_ids   = get_option( 'sc_woo_import_ids', [] );
		$existing_ids[] = sanitize_key( $import_id );
		update_option( 'sc_woo_import_ids', $existing_ids, false );

		if ( $lock_acquired ) {
			$this->releaseLock( $lock_key );
		}
	}
}

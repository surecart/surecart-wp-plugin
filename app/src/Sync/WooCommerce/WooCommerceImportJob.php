<?php

namespace SureCart\Sync\WooCommerce;

use SureCart\Background\Job;

/**
 * Background job that imports WooCommerce products into SureCart.
 *
 * Paginates through WC products and dispatches batches of IDs to
 * WooCommerceImportTask for mapping and API import.
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
	 * Process one page of WooCommerce products.
	 *
	 * Fetches product IDs for the current page and dispatches them
	 * to the task for mapping and API import.
	 *
	 * @param mixed $args Queue item with 'page' and 'batch_size' keys.
	 *
	 * @return mixed Modified args for next page, or false when done.
	 */
	protected function task( $args ) {
		$page       = $args['page'] ?? 1;
		$batch_size = max( 1, min( 500, (int) ( $args['batch_size'] ?? 100 ) ) );

		if ( ! class_exists( 'WooCommerce' ) ) {
			return false;
		}

		// Cache imported IDs for the duration of this job run to avoid
		// repeated unbounded get_posts() queries on every page.
		$cache_key    = 'sc_woo_import_excluded_ids';
		$imported_ids = get_transient( $cache_key );

		if ( false === $imported_ids ) {
			$imported_ids = get_posts(
				[
					'post_type'   => 'product',
					'meta_key'    => '_surecart_imported', // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
					'fields'      => 'ids',
					'numberposts' => -1,
				]
			);
			// Cache for 1 hour — job will complete well within this window.
			set_transient( $cache_key, $imported_ids, HOUR_IN_SECONDS );
		}

		$query_args = [
			'limit'    => $batch_size,
			'page'     => $page,
			'return'   => 'ids',
			'paginate' => true,
		];

		if ( ! empty( $imported_ids ) ) {
			$query_args['exclude'] = $imported_ids;
		}

		$products = wc_get_products( $query_args );

		// Validate result in case WooCommerce was deactivated mid-sync.
		if ( ! is_object( $products ) || ! isset( $products->products, $products->max_num_pages ) ) {
			return false;
		}

		// Dispatch product IDs to the task for processing.
		if ( ! empty( $products->products ) ) {
			$this->task->queue( $products->products );
		}

		// More pages to process.
		if ( $products->max_num_pages > $page ) {
			return [
				'page'       => $page + 1,
				'batch_size' => $batch_size,
			];
		}

		return false;
	}

	/**
	 * Complete processing.
	 *
	 * Kicks off the queue immediately to start processing tasks.
	 */
	protected function complete() {
		delete_transient( 'sc_woo_import_excluded_ids' );
		\SureCart::queue()->run();
		parent::complete();
	}
}

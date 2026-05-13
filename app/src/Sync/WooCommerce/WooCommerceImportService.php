<?php

namespace SureCart\Sync\WooCommerce;

use SureCart\Sync\ImportState;

/**
 * Thin service for WooCommerce product import.
 *
 * Handles bootstrapping (admin notices), dispatching the background job,
 * and providing import status/count queries.
 *
 * @package SureCart
 */
class WooCommerceImportService {

	/**
	 * Application instance.
	 *
	 * @var \SureCart\Application
	 */
	protected $app;

	/**
	 * WooCommerce import state tracker.
	 *
	 * @var ImportState
	 */
	protected $import_state;

	/**
	 * Constructor.
	 *
	 * @param \SureCart\Application $app The application.
	 * @param ImportState           $import_state Import state for WooCommerce runs.
	 */
	public function __construct( $app, ImportState $import_state ) {
		$this->app          = $app;
		$this->import_state = $import_state;
	}

	/**
	 * Bootstrap admin notices.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_action( 'admin_notices', [ $this, 'showSyncNotice' ] );
		add_action( 'admin_notices', [ $this, 'showCompletionNotice' ] );
	}

	/**
	 * Get the background import job instance.
	 *
	 * @return WooCommerceImportJob
	 */
	private function job() {
		return $this->app->resolve( 'surecart.jobs.woo_import' );
	}

	/**
	 * Is the import currently running?
	 *
	 * @return boolean
	 */
	public function isRunning() {
		return $this->job()->isRunning();
	}

	/**
	 * Dispatch the import job.
	 *
	 * Only one import can run at a time — isRunning() prevents concurrent dispatches.
	 * WordPress options (sc_woo_import_ids, sc_woo_import_session_id) are used for
	 * per-import state tracking, which is safe under this single-import constraint.
	 *
	 * @param int $batch_size Products per batch page.
	 *
	 * @return array|\WP_Error
	 */
	public function dispatch( $batch_size = 100 ) {
		// Clear previously accumulated import IDs and session tracking.
		$this->import_state->reset();

		$batch_size = apply_filters( 'surecart/sync/woocommerce_products/batch_size', $batch_size );
		$batch_size = max( 1, min( 500, (int) $batch_size ) );

		return $this->job()->push_to_queue(
			[
				'page'       => 1,
				'batch_size' => $batch_size,
			]
		)->save()->dispatch();
	}

	/**
	 * Get the count of importable (not yet imported) WooCommerce products.
	 *
	 * Uses pre-fetched imported IDs with 'exclude' parameter instead of
	 * a slow NOT EXISTS meta query.
	 *
	 * @return int
	 */
	public function getImportableCount() {
		if ( ! class_exists( 'WooCommerce' ) ) {
			return 0;
		}

		// Purge stale import flags (throttled — runs once every 6 hours).
		$this->purgeStaleImportMeta();

		// Pre-fetch already-imported product IDs (EXISTS meta query is faster than NOT EXISTS).
		$imported_ids = get_posts(
			[
				'post_type'   => 'product',
				'meta_key'    => '_surecart_imported', // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
				'fields'      => 'ids',
				'numberposts' => -1,
			]
		);

		$query_args = [
			'limit'    => 1,
			'page'     => 1,
			'return'   => 'ids',
			'paginate' => true,
		];

		if ( ! empty( $imported_ids ) ) {
			$query_args['exclude'] = $imported_ids;
		}

		$products = wc_get_products( $query_args );

		if ( ! is_object( $products ) || ! isset( $products->total ) ) {
			return 0;
		}

		return (int) $products->total;
	}

	/**
	 * Cross-reference WC import flags against local sc_product posts.
	 * Clears stale _surecart_imported meta for WC products whose
	 * corresponding SC product no longer exists locally.
	 *
	 * Throttled to run at most once every 6 hours.
	 *
	 * @return void
	 */
	protected function purgeStaleImportMeta() {
		// Throttle: skip if already checked recently.
		if ( get_transient( 'sc_woo_import_purge_checked' ) ) {
			return;
		}

		// 1. Get all WC products marked as imported.
		$imported_wc_ids = get_posts(
			[
				'post_type'   => 'product',
				'meta_key'    => '_surecart_imported', // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
				'fields'      => 'ids',
				'numberposts' => -1,
			]
		);

		// Mark as checked (even if nothing to do).
		set_transient( 'sc_woo_import_purge_checked', true, 6 * HOUR_IN_SECONDS );

		if ( empty( $imported_wc_ids ) ) {
			return;
		}

		// 2. Single DB query: get all wc_product_ids from sc_product posts.
		$valid_wc_ids = $this->getValidImportedWcIds();

		// 3. Find stale entries.
		$stale_wc_ids = array_diff( $imported_wc_ids, $valid_wc_ids );

		if ( empty( $stale_wc_ids ) ) {
			return;
		}

		// 4. Clear stale import flags.
		foreach ( $stale_wc_ids as $wc_id ) {
			delete_post_meta( (int) $wc_id, '_surecart_imported' );
		}

		// 5. Invalidate cached excluded IDs.
		delete_transient( 'sc_woo_import_excluded_ids' );
	}

	/**
	 * Single DB query to extract wc_product_id values from sc_product post meta.
	 * Uses LIKE to skip non-WC products at the DB level.
	 *
	 * @return int[] Valid WC product IDs that still have a local SC product.
	 */
	protected function getValidImportedWcIds() {
		global $wpdb;

		// One query: join posts + postmeta, filter to sc_product with wc_product_id.
		$rows = $wpdb->get_col( $wpdb->prepare(
			"SELECT pm.meta_value
			 FROM {$wpdb->postmeta} pm
			 JOIN {$wpdb->posts} p ON p.ID = pm.post_id
			 WHERE p.post_type = 'sc_product'
			   AND pm.meta_key = 'product'
			   AND pm.meta_value LIKE %s",
			$wpdb->esc_like( '%wc_product_id%' )
		) );

		$valid_ids = [];
		foreach ( $rows as $serialized ) {
			$data = maybe_unserialize( $serialized );

			// Extract metadata — may be object or array at any nesting level.
			$metadata = is_object( $data ) ? ( $data->metadata ?? null ) : ( $data['metadata'] ?? null );
			$wc_id    = is_object( $metadata ) ? ( $metadata->wc_product_id ?? null ) : ( is_array( $metadata ) ? ( $metadata['wc_product_id'] ?? null ) : null );

			if ( ! empty( $wc_id ) ) {
				$valid_ids[] = (int) $wc_id;
			}
		}

		return $valid_ids;
	}

	/**
	 * Show an admin notice if products are being imported.
	 *
	 * @return void
	 */
	public function showSyncNotice() {
		// Don't show on the import results page -- the user is already viewing results.
		if ( 'import_results' === ( isset( $_GET['action'] ) ? sanitize_text_field( wp_unslash( $_GET['action'] ) ) : '' ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			return;
		}

		if ( ! $this->isRunning() ) {
			return;
		}

		echo wp_kses_post(
			\SureCart::notices()->render(
				[
					'type'  => 'info',
					'title' => esc_html__( 'SureCart: WooCommerce products import in progress.', 'surecart' ),
					'text'  => '<p>' . esc_html__( 'SureCart is importing WooCommerce products in the background. The process may take a little while, so please be patient.', 'surecart' ) . '</p>',
				]
			)
		);
	}

	/**
	 * Show a completion notice after import finishes.
	 *
	 * @return void
	 */
	public function showCompletionNotice() {
		// Don't show on the import results page -- the user is already viewing results.
		if ( 'import_results' === ( isset( $_GET['action'] ) ? sanitize_text_field( wp_unslash( $_GET['action'] ) ) : '' ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			return;
		}

		// don't show if import is still running.
		if ( $this->isRunning() ) {
			return;
		}

		$state                  = $this->import_state;
		$import_ids             = $state->getResultIds();
		$all_skipped_session_id = $state->getAllSkippedSessionId();

		// Lazily detect the all-skipped case: no imports created but skipped products exist.
		// This mutation lives in the notice renderer (not in Job::complete()) because the Job
		// finishes before tasks complete — tasks run async via Action Scheduler, so result IDs
		// aren't available yet at Job::complete() time. The write is idempotent (same session_id
		// every time), so concurrent admin page loads are harmless.
		if ( empty( $import_ids ) && ! $all_skipped_session_id ) {
			if ( $state->getSessionId() && ! empty( $state->getSkippedItems() ) ) {
				$state->markAllSkipped();
				$all_skipped_session_id = $state->getAllSkippedSessionId();
			}
		}

		// Generate results URL and notice name per branch.
		$notice_name = '';
		if ( ! empty( $import_ids ) ) {
			// Normal case: has import_ids.
			$results_url = \SureCart::getUrl()->importResults( 'products', $import_ids, $state->getSessionId() );
			$notice_name = 'woo_import_complete_' . md5( implode( ',', $import_ids ) );
		} elseif ( $all_skipped_session_id ) {
			// All-skipped case: use session_id.
			$results_url = \SureCart::getUrl()->importResultsBySession( 'products', $all_skipped_session_id );
			$notice_name = 'woo_import_complete_' . md5( $all_skipped_session_id );
		} else {
			// No data available, skip notice.
			return;
		}

		echo wp_kses_post(
			\SureCart::notices()->render(
				[
					'name'  => $notice_name,
					'type'  => 'success',
					'title' => esc_html__( 'SureCart: WooCommerce products import complete.', 'surecart' ),
					'text'  => '<p>' . sprintf(
						/* translators: %s: URL to import results page */
						__( 'The import has finished. <a href="%s">View Import Results</a>', 'surecart' ),
						esc_url( $results_url )
					) . '</p>',
				]
			)
		);
	}
}

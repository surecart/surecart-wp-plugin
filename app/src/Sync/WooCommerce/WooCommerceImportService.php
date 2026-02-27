<?php

namespace SureCart\Sync\WooCommerce;

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
	 * Constructor.
	 *
	 * @param \SureCart\Application $app The application.
	 */
	public function __construct( $app ) {
		$this->app = $app;
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
	 * @param int $batch_size Products per batch page.
	 *
	 * @return array|\WP_Error
	 */
	public function dispatch( $batch_size = 100 ) {
		// Clear previously accumulated import IDs and session tracking.
		delete_option( 'sc_woo_import_ids' );
		delete_option( 'sc_woo_import_session_id' );
		delete_option( 'sc_woo_import_all_skipped' );

		$batch_size = apply_filters( 'surecart/sync/woocommerce_products/batch_size', $batch_size );

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
	 * @return int
	 */
	public function getImportableCount() {
		if ( ! class_exists( 'WooCommerce' ) ) {
			return 0;
		}

		$mapper = new WooCommerceProductMapper();

		add_filter( 'woocommerce_product_data_store_cpt_get_products_query', [ $mapper, 'excludeImportedProducts' ], 10, 2 );

		$products = wc_get_products(
			[
				'limit'                 => 1,
				'page'                  => 1,
				'return'                => 'ids',
				'paginate'              => true,
				'surecart_not_imported' => true,
			]
		);

		remove_filter( 'woocommerce_product_data_store_cpt_get_products_query', [ $mapper, 'excludeImportedProducts' ], 10 );

		if ( ! is_object( $products ) || ! isset( $products->total ) ) {
			return 0;
		}

		return (int) $products->total;
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

		$import_ids             = get_option( 'sc_woo_import_ids', [] );
		$all_skipped_session_id = get_option( 'sc_woo_import_all_skipped' );

		// Generate results URL and notice name per branch.
		$notice_name = '';
		if ( ! empty( $import_ids ) ) {
			// Normal case: has import_ids.
			$results_url = \SureCart::getUrl()->importResults( 'products', $import_ids );
			$notice_name = 'woo_import_complete_' . md5( implode( ',', $import_ids ) );
		} elseif ( $all_skipped_session_id ) {
			// All-skipped case: use session_id.
			$results_url = add_query_arg(
				[
					'page'       => 'sc-products',
					'action'     => 'import_results',
					'session_id' => $all_skipped_session_id,
				],
				admin_url( 'admin.php' )
			);
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

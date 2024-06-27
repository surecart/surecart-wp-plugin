<?php

namespace SureCart\Sync\Products;

/**
 * Syncs customer records to WordPress users.
 */
class ProductsSyncService {
	/**
	 * Application instance.
	 *
	 * @var \SureCart\Application
	 */
	protected $app = null;

	/**
	 * Constructor.
	 *
	 * @param \SureCart\Application $app The application.
	 */
	public function __construct( $app ) {
		$this->app = $app;
	}

	/**
	 * Get the queue process.
	 *
	 * @return ProductsQueueProcess
	 */
	public function queue() {
		return $this->app->resolve( 'surecart.process.products.queue' );
	}

	/**
	 * Get the sync process.
	 *
	 * @return ProductsSyncProcess
	 */
	public function sync() {
		return $this->app->resolve( 'surecart.process.products.sync' );
	}

	/**
	 * Cancel the process.
	 *
	 * This cancels the queue and sync processes
	 * and also deletes all the queue and sync items.
	 *
	 * @return void
	 */
	public function cancel() {
		$this->queue()->cancel();
		$this->queue()->delete_all();
		$this->sync()->cancel();
		$this->sync()->delete_all();
	}

	/**
	 * Is this process active?
	 *
	 * @return boolean
	 */
	public function isActive() {
		if ( $this->queue()->is_active() ) {
			return 'queue';
		}
		if ( $this->sync()->is_active() ) {
			return 'sync';
		}
		return false;
	}

	/**
	 * Bootstrap the service.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_action( 'admin_notices', [ $this, 'showMigrationNotice' ] );
	}

	/**
	 * Show the migration notice.
	 *
	 * @return void
	 */
	public function showMigrationNotice() {
		if ( ! $this->isActive() ) {
			return;
		}
		echo wp_kses_post(
			\SureCart::notices()->render(
				[
					'type'  => 'info',
					'title' => esc_html__( 'SureCart Product Sync In Progress', 'surecart' ),
					'text'  => wp_sprintf(
						'<p>%s</p>
						<p><a href="%s" class="button button-secondary" id="surecart-migration-cancel">%s</a></p>',
						esc_html__( 'SureCart is syncing products in the background. The process may take a little while, so please be patient.', 'surecart' ),
						esc_url(
							add_query_arg(
								[
									'action' => 'cancel_sync_products',
									'nonce'  => wp_create_nonce( 'cancel_sync_products' ),
								],
								\SureCart::getUrl()->index( 'products' )
							)
						),
						esc_html__( 'Cancel', 'surecart' )
					),
				]
			)
		);
	}

	/**
	 * Start the sync process.
	 *
	 * @param boolean $args The arguments.
	 *
	 * @return array|WP_Error The response or WP_Error on failure.
	 */
	public function dispatch( $args = [] ) {
		$args = wp_parse_args(
			$args,
			[
				'page'     => 1,
				'per_page' => 25,
			]
		);

		// save and dispatch the process.
		return $this->queue()->push_to_queue( $args )->save()->dispatch();
	}
}

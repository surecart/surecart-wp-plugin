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
	 * The notice id.
	 *
	 * @var string
	 */
	protected $notice_id = 'surecart_products_sync';

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
					// 'name'  => $this->notice_id,
					'type'  => 'info',
					'title' => esc_html__( 'SureCart: Getting things ready...', 'surecart' ),
					'text'  => wp_sprintf(
						'<p>%s</p>',
						esc_html__( 'We are getting things ready and optimized in the background. This may take a few minutes.', 'surecart' )
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

		$this->cancel();

		// reset the notice.
		\SureCart::notices()->reset( $this->notice_id );

		// save and dispatch the process.
		return $this->queue()->push_to_queue( $args )->save()->dispatch();
	}
}

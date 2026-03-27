<?php

namespace SureCart\Sync;

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
	 * Bootstrap the service.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_action( 'admin_notices', [ $this, 'showMigrationNotice' ] );
	}

	/**
	 * Get the queue.
	 *
	 * @return object
	 */
	public function jobs() {
		return $this->app->resolve( 'surecart.jobs' );
	}

	/**
	 * Is this process active?
	 *
	 * @return boolean
	 */
	public function isActive() {
		return $this->jobs()->isActive();
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
					'name'  => $this->notice_id,
					'type'  => 'info',
					'title' => esc_html__( 'SureCart: Getting things ready...', 'surecart' ),
					'text'  => wp_sprintf(
						'<p>%s</p>',
						esc_html__( 'We are getting things ready and optimized in the background. This may take a few minutes.', 'surecart' ),
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

		// reset the notice.
		\SureCart::notices()->reset( $this->notice_id );

		// clear account cache.
		\SureCart::account()->clearCache();

		// run all jobs.
		return $this->jobs()->run( $args );
	}
}

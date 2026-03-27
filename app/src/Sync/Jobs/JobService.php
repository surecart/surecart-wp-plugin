<?php

namespace SureCart\Sync\Jobs;

/**
 * Job service.
 *
 * Jobs are processes that queue up tasks to be processed at later time.
 * These jobs handle queuing up and processing the syncing and cleanup of
 * products and collections.
 */
class JobService {
	/**
	 * The app.
	 *
	 * @var \SureCart\App
	 */
	protected $app;

	/**
	 * Constructor.
	 *
	 * @param \SureCart\App $app The app.
	 */
	public function __construct( $app ) {
		$this->app = $app;
	}

	/**
	 * Run all jobs.
	 *
	 * @param array $args The arguments.
	 *
	 * @return \WP_Error|void
	 */
	public function run( $args = [] ) {
		// cancel previous processes.
		$this->cancel();

		$args = wp_parse_args(
			$args,
			[
				'page'     => 1,
				'per_page' => 25,
			]
		);

		// run all jobs.
		$result['cleanup_collections'] = $this->cleanup()->collections()->data( $args )->save();
		$result['cleanup_products']    = $this->cleanup()->products()->data( $args )->save();
		$result['sync_products']       = $this->sync()->products()->data( $args )->save()->dispatch();

		// if any are \WP_Error, return the first one.
		foreach ( $result as $value ) {
			if ( is_wp_error( $value ) ) {
				error_log( $value->get_error_message() ); // phpcs:ignore
				return $value;
			}
		}

		return $result;
	}

	/**
	 * Get the sync jobs.
	 *
	 * @return \SureCart\Sync\SyncProcess
	 */
	public function sync() {
		return $this->app->resolve( 'surecart.jobs.sync' );
	}

	/**
	 * Get the cleanup jobs.
	 *
	 * @return \SureCart\Sync\CleanupProcess
	 */
	public function cleanup() {
		return $this->app->resolve( 'surecart.jobs.cleanup' );
	}

	/**
	 * Cancel all jobs.
	 *
	 * @return void
	 */
	public function cancel() {
		$this->sync()->cancel();
		$this->cleanup()->cancel();
	}

	/**
	 * Is the sync active?
	 *
	 * @return boolean
	 */
	public function isActive() {
		return $this->sync()->isActive() || $this->cleanup()->isActive();
	}
}

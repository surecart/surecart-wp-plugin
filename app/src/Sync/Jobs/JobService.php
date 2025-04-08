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

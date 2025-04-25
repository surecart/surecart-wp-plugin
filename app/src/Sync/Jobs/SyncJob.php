<?php

namespace SureCart\Sync\Jobs;

/**
 * Sync job.
 *
 * Handles the sync process for the products.
 */
class SyncJob {
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
	 * Cancel all jobs.
	 *
	 * @return void
	 */
	public function cancel() {
		$this->products()->cancel();
	}

	/**
	 * Is the sync active?
	 *
	 * @return boolean
	 */
	public function isActive() {
		return $this->products()->isRunning();
	}

	/**
	 * Get the sync process.
	 *
	 * @return \SureCart\Sync\SyncProcess
	 */
	public function products() {
		return $this->app->resolve( 'surecart.jobs.sync.products' );
	}
}

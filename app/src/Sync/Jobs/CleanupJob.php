<?php

namespace SureCart\Sync\Jobs;

/**
 * Cleanup job.
 *
 * Handles the cleanup job for the products.
 */
class CleanupJob {
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
	 * Get the queue process.
	 *
	 * @return \SureCart\Sync\QueueProcess
	 */
	public function products() {
		return $this->app->resolve( 'surecart.jobs.cleanup.products' );
	}

	/**
	 * Get the collections process.
	 *
	 * @return \SureCart\Sync\CollectionsProcess
	 */
	public function collections() {
		return $this->app->resolve( 'surecart.jobs.cleanup.collections' );
	}

	/**
	 * Cancel all jobs.
	 *
	 * @return void
	 */
	public function cancel() {
		$this->products()->cancel();
		$this->collections()->cancel();
	}

	/**
	 * Is the cleanup active?
	 *
	 * @return boolean
	 */
	public function isActive() {
		return $this->products()->isRunning() || $this->collections()->isRunning();
	}
}

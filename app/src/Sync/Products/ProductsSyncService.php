<?php

namespace SureCart\Sync\Products;

/**
 * Syncs customer records to WordPress users.
 */
class ProductsSyncService {
	/**
	 * Holds the sync process.
	 *
	 * @var \SureCart\Background\BackgroundProcess
	 */
	protected $process;

	/**
	 * Get the processes.
	 *
	 * @param \SureCart\Background\BackgroundProcess $process The process.
	 */
	public function __construct( \SureCart\Background\BackgroundProcess $process ) {
		$this->process = $process;
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
				'page'             => 1,
				'per_page'         => 25,
				'with_collections' => false,
			]
		);

		// save and dispatch the process.
		return $this->process->push_to_queue( $args )->save()->dispatch();
	}
}

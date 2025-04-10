<?php

namespace SureCart\Sync\Jobs\Sync;

use SureCart\Background\BackgroundProcess;
use SureCart\Models\Product;

/**
 * This process fetches and queues all products for syncing.
 */
class ProductsSyncJob extends BackgroundProcess {
	/**
	 * The prefix for the action.
	 *
	 * @var string
	 */
	protected $prefix = 'surecart';

	/**
	 * The action.
	 *
	 * @var string
	 */
	protected $action = 'queue_products';

	/**
	 * The task.
	 *
	 * @var \SureCart\Sync\Tasks\Task
	 */
	protected $task;

	/**
	 * Constructor.
	 *
	 * @param \SureCart\Sync\Tasks\Task $task The task.
	 */
	public function __construct( $task ) {
		parent::__construct();
		$this->task = $task;
	}

	/**
	 * Perform task with queued item.
	 *
	 * Override this method to perform any actions required on each
	 * queue item. Return the modified item for further processing
	 * in the next pass through. Or, return false to remove the
	 * item from the queue.
	 *
	 * @param mixed $args Queue item to iterate over.
	 *
	 * @return mixed
	 */
	protected function task( $args ) {
		// get the items (uncached).
		$products = Product::where( [ 'cached' => false ] )::paginate(
			[
				'page'     => $args['page'] ?? 1,
				'per_page' => $args['batch_size'] ?? 25,
			]
		);

		if ( is_wp_error( $products ) ) {
			error_log( $products->get_error_message() );
			return false;
		}

		// add each item to the queue.
		foreach ( $products->data as $product ) {
			$this->task->queue( $product->id );
		}

		// we have more to process.
		if ( $products->hasNextPage() ) {
			return [
				'page'       => $products->pagination->page + 1,
				'batch_size' => $args['batch_size'] ?? 25,
			];
		}

		// nothing more to process.
		return false;
	}

	/**
	 * Complete processing.
	 *
	 * Override if applicable, but ensure that the below actions are
	 * performed, or, call parent::complete().
	 */
	protected function complete() {
		// kick off the queue process immediately (instead of waiting for the next scheduled run).
		\SureCart::queue()->run();

		// call the parent complete method.
		parent::complete();
	}
}

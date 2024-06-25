<?php

namespace SureCart\Sync\Products;

use SureCart\Background\BackgroundProcess;
use SureCart\Models\Product;

/**
 * This process fetches and queues all products for syncing.
 */
class ProductsQueueProcess extends BackgroundProcess {
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
	 * The interval for the cron.
	 *
	 * @var int
	 */
	protected $cron_interval = 1;

	/**
	 * The process to run on complete.
	 *
	 * @var \SureCart\Background\BackgroundProcess
	 */
	protected $sync_process;

	/**
	 * Construct the process.
	 *
	 * @param \SureCart\Background\BackgroundProcess $sync_process The process to run on complete.
	 */
	public function __construct( \SureCart\Background\BackgroundProcess $sync_process ) {
		$this->sync_process = $sync_process;
		parent::__construct();
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
		// the current page.
		$page = $args['page'] ?? 1;

		// get the items.
		$items = Product::paginate(
			[
				'page'     => $page,
				'per_page' => $args['batch_size'] ?? 25,
			]
		);

		// TODO: Store errors in database and show admin notice.
		if ( is_wp_error( $items ) ) {
			error_log( $items->get_error_message() );
			// maybe cancel all?
			return false;
		}

		// add each item to the queue.
		foreach ( $items->data as $item ) {
			$this->sync_process->push_to_queue(
				[
					'id'               => $item->id,
					'with_collections' => $args['with_collections'] ?? false,
				],
			);
		}

		// save the queue for later processing.
		$this->sync_process->save();

		// we have more to process.
		if ( $items->hasNextPage() ) {
			return [
				'page'             => $items->pagination->page + 1,
				'batch_size'       => $args['batch_size'] ?? 25,
				'with_collections' => $args['with_collections'] ?? false,
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
		// When everything is queued, dispatch the complete process.
		$this->sync_process->dispatch();

		// call the parent complete method.
		parent::complete();
	}
}

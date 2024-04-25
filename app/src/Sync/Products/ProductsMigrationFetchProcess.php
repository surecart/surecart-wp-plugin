<?php

namespace SureCart\Sync\Products;

use SureCart\Models\Product;

/**
 * This class dispatches model pull requests.
 */
class ProductsFetchProcess  extends BackgroundProcess {
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
	protected $action = 'product_fetch';

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
				'per_page' => 25,
			]
		);

		// TODO: Store errors in database and show admin notice.
		if ( is_wp_error( $items ) ) {
			error_log( $items->get_error_message() );
			// maybe cancel all?
			return false;
		}

		$products_queue = \SureCart::sync()->products()->syncQueue();
		foreach ( $items->data as $item ) {
			$products_queue->push_to_queue(
				[
					'id'    => $item->id,
					'model' => $args['model'],
				],
			);
		}
		$products_queue->save();

		// we have more to process.
		if ( $items->hasNextPage() ) {
			return [
				'model' => $args['model'],
				'page'  => $items->pagination->page + 1,
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
		parent::complete();
		// All these fetches are complete, so we can now sync the data.
		\SureCart::migration()->sync()->dispatch();
	}
}
}

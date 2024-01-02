<?php
namespace SureCart\Background\Migration;

use SureCart\Background\BackgroundProcess;

/**
 * This class dispatches model pull requests.
 */
class ModelFetchJob extends BackgroundProcess {
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
	protected $action = 'model_fetch';

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

		// get the model.
		$model = new $args['model']();

		// get the items.
		$items = $model->paginate(
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

		// add each item to the queue.
		foreach ( $items->data as $item ) {
			// add to items queue.
			\SureCart::migration()->sync()->push_to_queue(
				[
					'id'    => $item->id,
					'model' => $args['model'],
				],
			)->save();
		}

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

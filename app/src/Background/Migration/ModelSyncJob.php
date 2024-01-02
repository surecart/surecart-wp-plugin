<?php
namespace SureCart\Background\Migration;

use SureCart\Background\BackgroundProcess;

/**
 * This class dispatches model pull requests.
 */
class ModelSyncJob extends BackgroundProcess {
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
	protected $action = 'model_sync';

	/**
	 * What expands to do for each model.
	 *
	 * @var array
	 */
	protected $expands = [
		\SureCart\Models\ProductMedia::class => [ 'media' ],
	];

	/**
	 * Perform task with queued item.
	 *
	 * Override this method to perform any actions required on each
	 * queue item. Return the modified item for further processing
	 * in the next pass through. Or, return false to remove the
	 * item from the queue.
	 *
	 * @param mixed $item Queue item to iterate over.
	 *
	 * @return mixed
	 */
	protected function task( $item ) {
		// sanity check.
		if ( ! isset( $item['model'] ) || ! isset( $item['id'] ) ) {
			error_log( 'Invalid model sync request.' );
			return false;
		}

		try {
			// sync the model.
			$model = new $item['model']();

			// get any needed expands.
			if ( ! empty( $this->expands[ $item['model'] ] ) ) {
				$model->with( $this->expands[ $item['model'] ] );
			}

			// find and sync.
			$model = $model->find( $item['id'] );

			if ( is_wp_error( $model ) ) {
				error_log( $model->get_error_message() );
				return false;
			}

			$model->sync();
			return false;
		} catch ( \Exception $e ) {
			error_log( 'Error syncing model: ' . $item['model'] . ' with id: ' . $item['id'] );
			error_log( $e->getMessage() );
			return false;
		}

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
		// \SureCart::migration()->sync()->dispatch();
	}
}

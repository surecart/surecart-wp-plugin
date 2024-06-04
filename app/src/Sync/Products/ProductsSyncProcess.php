<?php
namespace SureCart\Sync\Products;

use SureCart\Background\BackgroundProcess;
use SureCart\Models\Product;

/**
 * This syncs product record as a process.
 */
class ProductsSyncProcess extends BackgroundProcess {
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
	protected $action = 'sync_products';

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
		if ( ! isset( $item['id'] ) ) {
			error_log( 'Invalid model sync request.' );
			return false;
		}

		try {
			// find and sync.
			$model = Product::findSyncable( $item['id'] );

			if ( is_wp_error( $model ) ) {
				error_log( $model->get_error_message() );
				return false;
			}

			$model->sync( $item['with_collections'] ?? false );
		} catch ( \Exception $e ) {
			error_log( 'Error syncing model: ' . $item['model'] . ' with id: ' . $item['id'] );
			error_log( $e->getMessage() );
			return false;
		}

		return false;
	}
}

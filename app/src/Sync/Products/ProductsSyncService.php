<?php
namespace SureCart\Sync\Products;

/**
 * This class dispatches model pull requests.
 */
class ProductsSyncService {
	public function bootstrap() {
		// when the fetch is completed, sync the products.
		// do_action( $this->identifier . '_completed' );

		// first get items to sync. we will store them in the queue.
	}

	public function syncQueue() {

	}

	/**
	 * Sync all the products
	 *
	 * @var string
	 */
	public function sync() {
		// first get items to sync.
		// then pass them off to the sync process.
	}
}

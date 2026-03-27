<?php

namespace SureCart\Sync\Tasks;

use SureCart\Models\Product;

/**
 * This syncs an individual product to a post asynchronously.
 */
class ProductSyncTask extends Task {
	/**
	 * The action name.
	 *
	 * @var string
	 */
	protected $action_name = 'surecart/sync/product';

	/**
	 * Fetch and sync product.
	 *
	 * @param string $id The product id to sync.
	 *
	 * @throws \Exception If there is an error.
	 *
	 * @return \WP_Post|\WP_Error
	 */
	public function handle( $id ) {
		return Product::sync( $id );
	}
}

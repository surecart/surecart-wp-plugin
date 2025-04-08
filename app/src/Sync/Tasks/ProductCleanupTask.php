<?php

namespace SureCart\Sync\Tasks;

/**
 * This delete's an individual product post asynchronously.
 */
class ProductCleanupTask extends Task {
	/**
	 * The action name.
	 *
	 * @var string
	 */
	protected $action_name = 'surecart/cleanup/product';

	/**
	 * Fetch and delete product post.
	 *
	 * @param string $id The product post id to delete.
	 *
	 * @return \WP_Post|false|null
	 */
	public function handle( $id ) {
		return wp_delete_post( $id );
	}
}

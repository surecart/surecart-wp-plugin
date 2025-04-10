<?php

namespace SureCart\Sync\Tasks;

/**
 * This delete's an individual collection term asynchronously.
 */
class CollectionCleanupTask extends Task {
	/**
	 * The action name.
	 *
	 * @var string
	 */
	protected $action_name = 'surecart/cleanup/collection';

	/**
	 * Always show a notice.
	 *
	 * @var boolean
	 */
	protected $show_notice = true;

	/**
	 * Fetch and delete product post.
	 *
	 * @param string $id The product post id to delete.
	 *
	 * @return \WP_Post|false|null
	 */
	public function handle( $id ) {
		return wp_delete_term( $id, 'sc_collection' );
	}
}

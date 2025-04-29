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
	 * Always show a notice.
	 *
	 * @var boolean
	 */
	protected $show_notice = true;

	/**
	 * Fetch and trash product post.
	 *
	 * It's safer to trash the post since there can be data loss
	 * as some data is stored locally in the database.
	 *
	 * @param string $id The product post id to delete.
	 *
	 * @return \WP_Post|false|null
	 */
	public function handle( $id ) {
		return wp_trash_post( $id );
	}
}

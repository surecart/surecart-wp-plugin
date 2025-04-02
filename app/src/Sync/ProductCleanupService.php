<?php

namespace SureCart\Sync;

/**
 * This delete's an individual product post asynchronously.
 */
class ProductCleanupService {
	/**
	 * The action name.
	 *
	 * @var string
	 */
	protected $action_name = 'surecart/cleanup/product';

	/**
	 * Bootstrap any actions.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_action( $this->action_name, [ $this, 'handleScheduledSync' ], 10, 2 );
	}

	/**
	 * Queue the sync for a later time.
	 *
	 * @param int $product_post_id The product post id.
	 *
	 * @return \SureCart\Queue\Async
	 */
	public function queue( $product_post_id ) {
		return \SureCart::queue()->async(
			$this->action_name,
			[
				'id'          => $product_post_id,
				'show_notice' => true,
			],
			'product-cleanup-' . $product_post_id, // unique id for the product.
			true // force unique. This will replace any existing jobs.
		);
	}

	/**
	 * Fetch and delete product post.
	 *
	 * @param string $id The product post id to delete.
	 *
	 * @return \WP_Post|false|null
	 */
	public function handleScheduledSync( $id ) {
		return wp_delete_post( $id );
	}
}

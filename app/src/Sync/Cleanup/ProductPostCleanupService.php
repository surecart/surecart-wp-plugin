<?php

namespace SureCart\Sync;

/**
 * This syncs an individual product to a post asynchronously.
 */
class ProductPostCleanupService {
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
		add_action( $this->action_name, [ $this, 'handle' ], 10, 2 );
	}

	/**
	 * Queue the sync for a later time.
	 *
	 * @param \WP_Post $post The post or post id.
	 *
	 * @return \SureCart\Queue\Async
	 */
	public function queue( $post ) {
		$id = is_object( $post ) ? $post->ID : $post;
		return \SureCart::queue()->async(
			$this->action_name,
			[
				'id' => $id,
			],
			'product-' . $id, // unique id for the product.
			true // force unique. This will replace any existing jobs.
		);
	}

	/**
	 * Check if the sync is scheduled.
	 *
	 * @param \WP_Post $post The post or post id.
	 *
	 * @return bool
	 */
	public function isScheduled( $post ) {
		$id = is_object( $post ) ? $post->ID : $post;
		return \SureCart::queue()->isScheduled(
			$this->action_name,
			[
				'id' => $id,
			],
			'product-' . $id
		);
	}

	/**
	 * Cancel the sync for a later time.
	 *
	 * @param \SureCart\Models\Model $model The model.
	 *
	 * @return \SureCart\Queue\Async
	 */
	public function cancel( $post ) {
		$id = is_object( $post ) ? $post->ID : $post;
		return \SureCart::queue()->cancel(
			$this->action_name,
			[
				'id' => $id,
			],
			'product-' . $id, // unique id for the product.
			true // force unique. This will replace any existing jobs.
		);
	}

	/**
	 * Handle the cleanup.
	 *
	 * @param string $id The product id to sync.
	 *
	 * @throws \Exception If there is an error.
	 *
	 * @return WP_Post|false|null Post data on success, false or null on failure.
	 */
	public function handle( $id ) {
		// check if the post has the taxonomy sc_acccount that matches the current account.
		$account = wp_get_object_terms( $id, 'sc_account' );

		// we don't have an account.
		if ( empty( $account ) || empty( \SureCart::account()->id ) ) {
			return;
		}

		// the account is the current account. We only delete if it's not the current account.
		if ( \SureCart::account()->id === $account ) {
			return;
		}

		return wp_delete_post( $id, true );
	}
}

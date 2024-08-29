<?php

namespace SureCart\Sync;

/**
 * This cleans up collections that are no
 * longer part of the current store.
 */
class CollectionCleanupService {
	/**
	 * The action name.
	 *
	 * @var string
	 */
	protected $action_name = 'surecart/cleanup/collection';

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
	 * @param \WP_Term $term The term or term id.
	 *
	 * @return \SureCart\Queue\Async
	 */
	public function queue( $term ) {
		$id = is_object( $term ) ? $term->term_id : $term;
		return \SureCart::queue()->async(
			$this->action_name,
			[
				'id' => $id,
			],
			'collection-' . $id, // unique id for the collection.
			true // force unique. This will replace any existing jobs.
		);
	}

	/**
	 * Check if the sync is scheduled.
	 *
	 * @param \WP_Term $term The term or term id.
	 *
	 * @return bool
	 */
	public function isScheduled( $term ) {
		$id = is_object( $term ) ? $term->term_id : $term;
		return \SureCart::queue()->isScheduled(
			$this->action_name,
			[
				'id' => $id,
			],
			'collection-' . $id
		);
	}

	/**
	 * Cancel the sync for a later time.
	 *
	 * @param \WP_Term $term The term or term id.
	 *
	 * @return \SureCart\Queue\Async
	 */
	public function cancel( $term ) {
		$id = is_object( $term ) ? $term->term_id : $term;
		return \SureCart::queue()->cancel(
			$this->action_name,
			[
				'id' => $id,
			],
			'collection-' . $id, // unique id for the collection.
			true // force unique. This will replace any existing jobs.
		);
	}

	/**
	 * Fetch and sync product.
	 *
	 * @param string $id The collection id to sync.
	 *
	 * @throws \Exception If there is an error.
	 *
	 * @return WP_Term|false|null Term data on success, false or null on failure.
	 */
	public function handle( $id ) {
		// check to make sure the collection's sc_account meta is the current account.
		$account = get_term_meta( $id, 'sc_account', true );

		// if the account is the current account, do not delete.
		if ( $account && \SureCart::account()->id === $account ) {
			return;
		}

		return wp_delete_term( $id, 'collection' );
	}
}

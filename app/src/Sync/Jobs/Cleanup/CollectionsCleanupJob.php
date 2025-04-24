<?php

namespace SureCart\Sync\Jobs\Cleanup;

use SureCart\Background\Job;

/**
 * This process fetches and queues all products collections for syncing.
 */
class CollectionsCleanupJob extends Job {
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
	protected $action = 'cleanup_product_collections';

	/**
	 * Perform task with queued item.
	 *
	 * Override this method to perform any actions required on each
	 * queue item. Return the modified item for further processing
	 * in the next pass through. Or, return false to remove the
	 * item from the queue.
	 *
	 * @param mixed $args Queue item to iterate over.
	 *
	 * @return mixed
	 */
	protected function task( $args ) {
		// Delete all terms who have sc_account in term meta as meta key & the value is not equal to the current account id.
		$batch_size = $args['batch_size'] ?? 25;
		$page       = $args['page'] ?? 1;
		$offset     = ( $page - 1 ) * $batch_size;

		$terms = get_terms(
			[
				'number'     => $batch_size,
				'offset'     => $offset,
				'taxonomy'   => 'sc_collection',
				'hide_empty' => false,
				'fields'     => 'ids',
				'meta_query' => [
					[
						'key'     => 'sc_account',
						'value'   => \SureCart::account()->id,
						'compare' => 'NOT IN', // Excludes terms where value is the current account ID.
					],
				],
			]
		);

		if ( empty( $terms ) ) {
			return false; // No more terms to delete, stop processing.
		}

		foreach ( $terms as $term_id ) {
			$this->task->queue( $term_id );
		}

		// If we got fewer terms than batch size, assume there are no more terms left.
		if ( count( $terms ) < $batch_size ) {
			return false;
		}

		// Continue processing the next batch.
		return [
			'page'       => $page + 1,
			'batch_size' => $batch_size,
		];
	}
}

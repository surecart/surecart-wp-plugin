<?php

namespace SureCart\Sync;

use SureCart\Background\BackgroundProcess;

/**
 * This process fetches and queues all products for syncing.
 */
class ProductsCleanupProcess extends BackgroundProcess {
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
	protected $action = 'cleanup_products';

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
		$query = new \WP_Query(
			[
				'post_type'        => 'sc_product',
				'post_status'      => [ 'publish', 'pending', 'draft', 'future', 'private', 'inherit', 'trash', 'auto-draft', 'sc_archived' ],
				'posts_per_page'   => absint( $args['batch_size'] ?? 25 ),
				'paged'            => absint( $args['page'] ?? 1 ),
				'suppress_filters' => true,
				'tax_query'        => [
					[
						'taxonomy' => 'sc_account',
						'field'    => 'name',
						'terms'    => [ \SureCart::account()->id ],
						'operator' => 'NOT IN',
					],
				],
			]
		);

		if ( is_wp_error( $query ) ) {
			error_log( $query->get_error_message() );
			return false;
		}

		// add each item to the queue.
		foreach ( $query->posts as $product ) {
			\SureCart::sync()
			->productCleanup()
			->queue( $product->ID );
		}

		if ( $query->max_num_pages > $query->query_vars['paged'] ) {
			return [
				'page'       => $query->query_vars['paged'] + 1,
				'batch_size' => $args['batch_size'] ?? 25,
			];
		}

		// nothing more to process.
		return false;
	}

	/**
	 * Complete processing.
	 *
	 * Override if applicable, but ensure that the below actions are
	 * performed, or, call parent::complete().
	 */
	protected function complete() {
		// kick off the queue process immediately (instead of waiting for the next scheduled run).
		\SureCart::queue()->run();

		// call the parent complete method.
		parent::complete();
	}
}

<?php

namespace SureCart\Sync\BackgroundProcessing;

use SureCart\Background\BackgroundProcess;
use SureCart\Models\Product;

/**
 * This process fetches all products that are not part of the current account
 * and queues them for deletion.
 */
class ProductsCleanupBackgroundProcess extends BackgroundProcess {
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
		// the current page.
		$page = $args['page'] ?? 1;

		// fetch all product posts that do not have the current \SureCart::account()->id as the sc_account taxonomy (using WP_Query).
		$products = new \WP_Query(
			[
				'post_type'      => 'product',
				'posts_per_page' => -1,
				'meta_query'     => [
					[
						'key'     => 'sc_account',
						'value'   => \SureCart::account()->id,
						'compare' => '!=',
					],
				],
			]
		);

		// delete each product post that is not in the current account.
		foreach ( $products->posts as $product ) {
			wp_delete_post( $product->ID, true );
		}

		// get the items (uncached).
		$products = Product::where( [ 'cached' => false ] )::paginate(
			[
				'page'     => $page,
				'per_page' => $args['batch_size'] ?? 25,
			]
		);

		if ( is_wp_error( $products ) ) {
			error_log( $products->get_error_message() );
			return false;
		}

		// add each item to the queue.
		foreach ( $products->data as $product ) {
			$product->queueSync();
		}

		// we have more to process.
		if ( $products->hasNextPage() ) {
			return [
				'page'       => $products->pagination->page + 1,
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

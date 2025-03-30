<?php

namespace SureCart\Sync;

/**
 * This delete's an individual collection term asynchronously.
 */
class CollectionsCleanupService {
	/**
	 * The action name.
	 *
	 * @var string
	 */
	protected $action_name = 'surecart/cleanup/collection';

	/**
	 * Application instance.
	 *
	 * @var \SureCart\Application
	 */
	protected $app = null;

	/**
	 * Constructor.
	 *
	 * @param \SureCart\Application $app The application.
	 */
	public function __construct( $app ) {
		$this->app = $app;
	}

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
	 * @param string $collection_term_id The term id.
	 *
	 * @return \SureCart\Queue\Async
	 */
	public function queue( $collection_term_id ) {
		return \SureCart::queue()->async(
			$this->action_name,
			[
				'id'          => $collection_term_id,
				'show_notice' => true,
			],
			'product-cleanup-' . $collection_term_id, // unique id for the term.
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
		return wp_delete_term( $id, 'sc_collection' );
	}
}

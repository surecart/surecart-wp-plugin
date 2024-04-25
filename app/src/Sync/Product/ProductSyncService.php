<?php


namespace SureCart\Sync\Product;

use SureCart\Models\Product;
use SureCart\Sync\Post\ProductPostSyncService;

/**
 * Syncs customer records to WordPress users.
 */
class ProductSyncService {
	/**
	 * The action name.
	 *
	 * @var string
	 */
	protected $action_name = 'surecart/sync/product';

	/**
	 * Bootstrap any actions.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_action( $this->action_name, [ $this, 'fetchAndSync' ], 10 );
	}

	/**
	 * Queue the sync for a later time.
	 *
	 * @param \SureCart\Models\Model $model The model.
	 *
	 * @return \SureCart\Queue\Async
	 */
	public function queue( \SureCart\Models\Model $model ) {
		return \SureCart::queue()->async( $this->action_name, [ 'id' => $model->id ] );
	}

	/**
	 * Run the model sync immediately.
	 *
	 * @param \SureCart\Models\Model $model The model.
	 * @param boolean                $with_collections Whether to sync with collections.
	 *
	 * @return \WP_Post|\WP_Error
	 */
	public function execute( \SureCart\Models\Model $model, $with_collections = false ) {
		return ProductPostSyncService::sync( $model, $with_collections );
	}

	/**
	 * Is this sync running.
	 *
	 * @param string $id The product id to check.
	 *
	 * @return boolean
	 */
	public function isScheduled( $id ) {
		return \SureCart::queue()->isScheduled( $this->action_name, [ 'id' => $id ] );
	}

	/**
	 * Has this product been synced recently.
	 *
	 * @param string $id The product id to check.
	 * @param string $time_ago The time ago to check.
	 *
	 * @return boolean
	 */
	public function hasRecentlySynced( $id, $time_ago = '5 minutes' ) {
		// get any syncs newer than the time ago.
		$last_sync = \SureCart::queue()->search(
			[
				'hook'         => $this->action_name,
				'args'         => [ 'id' => $id ],
				'date_compare' => '>', // after the time ago.
				'date'         => strtotime( '-' . $time_ago ), // 5 minutes ago.
				'per_page'     => 1, // only need one.
			],
			'ids' // return only the ids (more efficient).
		);

		// if we have a sync that is newer than the time ago, return true.
		return ! empty( $last_sync );
	}

	/**
	 * Sync product.
	 *
	 * @param string $id The product id to sync.
	 *
	 * @return void
	 */
	public function fetchAndSync( $id ) {
		// is scheduled or has recently synced.
		// this prevents multiple syncs from happening at the same time
		// or rapid syncing of products due to unforeseen circumstances.
		if ( $this->isScheduled( $id ) || $this->hasRecentlySynced( $id ) ) {
			return;
		}

		// get product.
		$product = Product::with( [ 'prices', 'variants', 'variant_options', 'product_medias', 'product_media.media' ] )->get( $id );

		// handle error.
		if ( is_wp_error( $product ) ) {
			return $product;
		}

		return $this->execute( $product );
	}
}

<?php


namespace SureCart\Sync\Product;

use SureCart\Models\Product;

/**
 * This syncs an individual product to a post asynchronously.
 */
class ProductSyncService {
	/**
	 * The action name.
	 *
	 * @var string
	 */
	protected $action_name = 'surecart/sync/product';

	/**
	 * Application instance.
	 *
	 * @var \SureCart\Application
	 */
	protected $app = null;

	/**
	 * Should we sync this with collections?
	 *
	 * @var string
	 */
	protected $with_collections = false;

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
		add_action( $this->action_name, [ $this, 'handleScheduledSync' ], 10 );
	}


	/**
	 * Post sync service
	 *
	 * @return ProductsQueueProcess
	 */
	public function post() {
		return $this->app->resolve( 'surecart.process.product_post.sync' );
	}

	/**
	 * Should we do it with collections?
	 *
	 * @param string $with_collections Whether to sync with collections.
	 *
	 * @return self
	 */
	public function withCollections( $with_collections = true ) {
		$this->with_collections = $with_collections;
		return $this;
	}

	/**
	 * Queue the sync for a later time.
	 *
	 * @param \SureCart\Models\Model $model The model.
	 *
	 * @return \SureCart\Queue\Async
	 */
	public function queue( \SureCart\Models\Model $model ) {
		return \SureCart::queue()->async(
			$this->action_name,
			[
				'id'               => $model->id,
				'with_collections' => $this->with_collections,
			]
		);
	}

	/**
	 * Run the model sync immediately.
	 *
	 * @param \SureCart\Models\Model $model The model.
	 *
	 * @return \WP_Post|\WP_Error
	 */
	public function sync( \SureCart\Models\Model $model ) {
		return $this->post()->withCollections( $this->with_collections )->sync( $model );
	}

	/**
	 * Run the model sync immediately.
	 *
	 * @param string $id The product id.
	 *
	 * @return \WP_Post|\WP_Error|false|null
	 */
	public function delete( string $id ) {
		return $this->post()->delete( $id );
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
	 * Fetch and sync product.
	 *
	 * @param string $id The product id to sync.
	 *
	 * @return void
	 */
	public function handleScheduledSync( $id ) {
		// is scheduled or has recently synced.
		// this prevents multiple syncs from happening at the same time
		// or rapid syncing of products due to unforeseen circumstances.
		if ( $this->isScheduled( $id ) || $this->hasRecentlySynced( $id ) ) {
			return;
		}

		// get product.
		$product = Product::with( [ 'image', 'prices', 'product_medias', 'product_media.media', 'variants', 'variant_options', 'product_collections', 'featured_product_media' ] )->get( $id );

		// handle error.
		if ( is_wp_error( $product ) ) {
			return $product;
		}

		return $this->sync( $product );
	}
}

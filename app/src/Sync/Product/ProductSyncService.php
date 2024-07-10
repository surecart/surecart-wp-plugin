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
	 * Post sync service
	 *
	 * @return ProductsQueueProcess
	 */
	public function post() {
		return $this->app->resolve( 'surecart.process.product_post.sync' );
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
				'id' => $model->id,
			],
			'product-' . $model->id, // unique id for the product.
			true // force unique. This will replace any existing jobs.
		);
	}

	/**
	 * Check if the sync is scheduled.
	 *
	 * @param \SureCart\Models\Model $model The model.
	 *
	 * @return bool
	 */
	public function isScheduled( \SureCart\Models\Model $model ) {
		return \SureCart::queue()->isScheduled(
			$this->action_name,
			[
				'id' => $model->id,
			],
			'product-' . $model->id
		);
	}

	/**
	 * Cancel the sync for a later time.
	 *
	 * @param \SureCart\Models\Model $model The model.
	 *
	 * @return \SureCart\Queue\Async
	 */
	public function cancel( \SureCart\Models\Model $model ) {
		return \SureCart::queue()->cancel(
			$this->action_name,
			[
				'id' => $model->id,
			],
			'product-' . $model->id, // unique id for the product.
			true // force unique. This will replace any existing jobs.
		);
	}

	/**
	 * Run the model sync immediately.
	 *
	 * @param \SureCart\Models\Product $product The Product.
	 *
	 * @return \WP_Post|\WP_Error
	 */
	public function sync( \SureCart\Models\Product $product ) {
		return $this->post()->sync( $product );
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
	 * Fetch and sync product.
	 *
	 * @param string $id The product id to sync.
	 *
	 * @throws \Exception If there is an error.
	 *
	 * @return \WP_Post|\WP_Error
	 */
	public function handleScheduledSync( $id ) {
		return Product::sync( $id );
	}
}

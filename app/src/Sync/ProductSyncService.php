<?php

namespace SureCart\Sync;

/**
 * This syncs an individual product to a post asynchronously.
 */
class ProductSyncService {
	/**
	 * Application instance.
	 *
	 * @var \SureCart\Application
	 */
	protected $app = null;

	/**
	 * Whether to show a notice.
	 *
	 * @var boolean
	 */
	protected $with_notice = false;

	/**
	 * Constructor.
	 *
	 * @param \SureCart\Application $app The application.
	 */
	public function __construct( $app ) {
		$this->app = $app;
	}

	/**
	 * Whether to show a notice.
	 *
	 * @param boolean $with_notice Whether to show a notice.
	 *
	 * @return self
	 */
	public function withNotice( $with_notice = true ) {
		$this->with_notice = $with_notice;
		return $this;
	}

	/**
	 * Get the task.
	 *
	 * @return \SureCart\Sync\Tasks\ProductSyncTask
	 */
	protected function task() {
		return $this->app->resolve( 'surecart.tasks.product.sync' )->withNotice( $this->with_notice );
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
		return $this->task()->queue( $model->id );
	}

	/**
	 * Check if the sync is scheduled.
	 *
	 * @param \SureCart\Models\Model $model The model.
	 *
	 * @return bool
	 */
	public function isScheduled( \SureCart\Models\Model $model ) {
		return $this->task()->isScheduled( $model->id );
	}

	/**
	 * Cancel the sync for a later time.
	 *
	 * @param \SureCart\Models\Model $model The model.
	 *
	 * @return \SureCart\Queue\Async
	 */
	public function cancel( \SureCart\Models\Model $model ) {
		return $this->task()->cancel( $model->id );
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
}

<?php

namespace SureCart\Sync;

use SureCart\Sync\CustomerSyncService;
use SureCart\Sync\PostSyncService;
use SureCart\Sync\ProductSyncService;
use SureCart\Sync\Jobs\Cleanup\CollectionsCleanupJob;
use SureCart\Sync\Jobs\Cleanup\ProductsCleanupJob;
use SureCart\Sync\Jobs\CleanupJob;
use SureCart\Sync\Jobs\SyncJob;
use SureCart\Sync\Jobs\JobService;
use SureCart\Sync\Jobs\Sync\ProductsSyncJob;
use SureCart\Sync\Tasks\ProductCleanupTask;
use SureCart\Sync\Tasks\ProductSyncTask;
use SureCart\Sync\ProductsSyncService;
use SureCart\Sync\StoreSyncService;
use SureCart\Sync\Tasks\CollectionCleanupTask;
use SureCartCore\ServiceProviders\ServiceProviderInterface;

/**
 * WordPress Users service.
 */
class SyncServiceProvider implements ServiceProviderInterface {
	/**
	 * Register all dependencies in the IoC container.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function register( $container ) {
		/**
		 * Get the app instance.
		 */
		$app = $container[ SURECART_APPLICATION_KEY ];

		/**
		 * Async tasks. These handle scheduled tasks.
		 */
		$container['surecart.tasks.product.sync']       = fn () => new ProductSyncTask();
		$container['surecart.tasks.product.cleanup']    = fn () => new ProductCleanupTask();
		$container['surecart.tasks.collection.cleanup'] = fn () => new CollectionCleanupTask();

		/**
		 * Jobs. These schedule the async tasks.
		 */
		$container['surecart.jobs']                     = fn() => new JobService( $app );
		$container['surecart.jobs.sync']                = fn() => new SyncJob( $app );
		$container['surecart.jobs.cleanup']             = fn() => new CleanupJob( $app );
		$container['surecart.jobs.cleanup.collections'] = fn() => new CollectionsCleanupJob( $container['surecart.tasks.collection.cleanup'] );
		$container['surecart.jobs.cleanup.products']    = fn() => ( new ProductsCleanupJob( $container['surecart.tasks.product.cleanup'] ) )->setNext( $container['surecart.jobs.cleanup.collections'] );
		$container['surecart.jobs.sync.products']       = fn() => ( new ProductsSyncJob( $container['surecart.tasks.product.sync'] ) )->setNext( $container['surecart.jobs.cleanup.products'] );

		/**
		 * Services
		 */
		$container['surecart.sync']                      = fn () => new SyncService( $app );
		$container['surecart.sync.product']              = fn () => new ProductSyncService( $app );
		$container['surecart.sync.products']             = fn () => new ProductsSyncService( $app );
		$container['surecart.sync.store']                = fn () => new StoreSyncService();
		$container['surecart.process.product_post.sync'] = fn () => new PostSyncService();
		$container['surecart.sync.customers']            = fn () => new CustomerSyncService();

		// Alias the sync service.
		$app->alias( 'sync', 'surecart.sync' );
	}

	/**
	 * Bootstrap any services if needed.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function bootstrap( $container ) {
		// call the jobs - this is required because ajax handlers are only available in the constructor.
		$container['surecart.jobs.cleanup.collections']->bootstrap();
		$container['surecart.jobs.cleanup.products']->bootstrap();
		$container['surecart.jobs.sync.products']->bootstrap();

		// bootstrap services.
		$container['surecart.sync.products']->bootstrap();
		$container['surecart.sync.customers']->bootstrap();
		$container['surecart.sync.store']->bootstrap();

		// Bootstrap tasks.
		$container['surecart.tasks.product.sync']->bootstrap();
		$container['surecart.tasks.product.cleanup']->bootstrap();
		$container['surecart.tasks.collection.cleanup']->bootstrap();
	}
}

<?php

namespace SureCart\Sync;

use SureCart\Sync\CollectionSyncService;
use SureCart\Sync\CustomerSyncService;
use SureCart\Sync\PostSyncService;
use SureCart\Sync\ProductSyncService;
use SureCart\Sync\ProductCleanupService;
use SureCart\Sync\CollectionsCleanupService;
use SureCart\Sync\ProductsSyncProcess;
use SureCart\Sync\ProductsCleanupProcess;
use SureCart\Sync\CollectionsCleanupProcess;
use SureCart\Sync\ProductsSyncService;
use SureCart\Sync\StoreSyncService;
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
		$container['surecart.sync']                      = fn ( $container ) => new SyncService( $container[ SURECART_APPLICATION_KEY ] );
		$container['surecart.sync.product']              = fn ( $container ) => new ProductSyncService( $container[ SURECART_APPLICATION_KEY ] );
		$container['surecart.sync.products']             = fn() => new ProductsSyncService( $container[ SURECART_APPLICATION_KEY ] );
		$container['surecart.sync.store']                = fn () => new StoreSyncService();
		$container['surecart.sync.product.cleanup']      = fn() => new ProductCleanupService();
		$container['surecart.sync.collections.cleanup']  = fn() => new CollectionsCleanupService();
		$container['surecart.sync.collection']           = fn() => new CollectionSyncService();
		$container['surecart.process.product_post.sync'] = fn() => new PostSyncService();
		$container['surecart.sync.customers']            = fn() => new CustomerSyncService();

		// Queues up the products for syncing and starts sync.
		$collections_cleanup_process                       = new CollectionsCleanupProcess();
		$container['surecart.process.collections.cleanup'] = fn() => $collections_cleanup_process;

		// Queues up the products for syncing and starts sync.
		$products_cleanup_process                       = new ProductsCleanupProcess();
		$container['surecart.process.products.cleanup'] = fn() => $products_cleanup_process;

		// Queues up the products for syncing and starts sync.
		$products_queue_process                       = new ProductsSyncProcess();
		$container['surecart.process.products.queue'] = fn() => $products_queue_process;

		$app = $container[ SURECART_APPLICATION_KEY ];

		// Alias the sync service
		$app->alias( 'sync', 'surecart.sync' );
	}

	/**
	 * Bootstrap any services if needed.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function bootstrap( $container ) {
		$container['surecart.sync.product']->bootstrap();
		$container['surecart.sync.product.cleanup']->bootstrap();
		$container['surecart.sync.collections.cleanup']->bootstrap();
		$container['surecart.sync.products']->bootstrap();
		$container['surecart.sync.customers']->bootstrap();
		$container['surecart.sync.store']->bootstrap();
	}
}

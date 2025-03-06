<?php

namespace SureCart\Sync;

use SureCart\Sync\CollectionSyncService;
use SureCart\Sync\CustomerSyncService;
use SureCart\Sync\PostSyncService;
use SureCart\Sync\ProductSyncService;
use SureCart\Sync\ProductCleanupService;
use SureCart\Sync\ProductsSyncProcess;
use SureCart\Sync\ProductsCleanupProcess;
use SureCart\Sync\ProductCollectionsCleanupProcess;
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
		$app = $container[ SURECART_APPLICATION_KEY ];

		$container['surecart.sync'] = fn ( $container ) =>
			new SyncService( $container[ SURECART_APPLICATION_KEY ] );

		$container['surecart.sync.store'] = fn ( $container ) =>
			new StoreSyncService( $container[ SURECART_APPLICATION_KEY ] );

		$container['surecart.sync.product'] = fn ( $container ) =>
			new ProductSyncService( $container[ SURECART_APPLICATION_KEY ] );

		$container['surecart.sync.product.cleanup'] = fn ( $container ) =>
			new ProductCleanupService( $container[ SURECART_APPLICATION_KEY ] );

		$container['surecart.sync.collection']           = fn() => new CollectionSyncService();
		$container['surecart.process.product_post.sync'] = fn() => new PostSyncService();
		$container['surecart.sync.customers']            = fn() => new CustomerSyncService();
		$container['surecart.sync.products']             = fn() => new ProductsSyncService( $container[ SURECART_APPLICATION_KEY ] );

		// Queues up the products for syncing and starts sync.
		$products_queue_process                       = new ProductsSyncProcess();
		$container['surecart.process.products.queue'] = fn() => $products_queue_process;

		$products_cleanup_process                       = new ProductsCleanupProcess();
		$container['surecart.process.products.cleanup'] = fn() => $products_cleanup_process;

		$collections_cleanup_process                       = new ProductCollectionsCleanupProcess();
		$container['surecart.process.collections.cleanup'] = fn() => $collections_cleanup_process;

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
		$container['surecart.sync.products']->bootstrap();
		$container['surecart.sync.customers']->bootstrap();
		$container['surecart.sync.store']->bootstrap();
	}
}

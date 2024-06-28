<?php

namespace SureCart\Sync;

use SureCart\Sync\Collection\CollectionSyncService;
use SureCart\Sync\Customers\CustomerSyncService;
use SureCart\Sync\Post\ProductPostSyncService;
use SureCart\Sync\Product\ProductSyncService;
use SureCart\Sync\Products\ProductsQueueProcess;
use SureCart\Sync\Products\ProductsSyncProcess;
use SureCart\Sync\Products\ProductsSyncService;
use SureCart\Sync\Store\StoreSyncService;
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

		// the sync service.
		$container['surecart.sync'] = function ( $container ) {
			return new SyncService( $container[ SURECART_APPLICATION_KEY ] );
		};

		// the sync service.
		$container['surecart.sync.store'] = function ( $container ) {
			return new StoreSyncService( $container[ SURECART_APPLICATION_KEY ] );
		};

		// the product sync service.
		$container['surecart.sync.product'] = function ( $container ) {
			return new ProductSyncService( $container[ SURECART_APPLICATION_KEY ] );
		};

		// the product sync service.
		$container['surecart.sync.collection'] = function () {
			return new CollectionSyncService();
		};

		// the products sync process.
		$container['surecart.process.product_post.sync'] = function () {
			return new ProductPostSyncService();
		};

		// the products sync process.
		// this needs to be instantiated on load.
		$products_sync_process                       = new ProductsSyncProcess();
		$container['surecart.process.products.sync'] = function () use ( $products_sync_process ) {
			return $products_sync_process;
		};

		// the products queue process. Needs the sync process to be injected.
		// this needs to be instantiated on load.
		$products_queue_process                       = new ProductsQueueProcess( $products_sync_process );
		$container['surecart.process.products.queue'] = function () use ( $products_queue_process ) {
			return $products_queue_process;
		};

		// the products sync service (bulk).
		$container['surecart.sync.products'] = function ( $container ) {
			return new ProductsSyncService( $container[ SURECART_APPLICATION_KEY ] );
		};

		// the customers sync service.
		$container['surecart.sync.customers'] = function () {
			return new CustomerSyncService();
		};

		// alias the services.
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
		$container['surecart.sync.products']->bootstrap();
		$container['surecart.sync.customers']->bootstrap();
		$container['surecart.sync.store']->bootstrap();
	}
}

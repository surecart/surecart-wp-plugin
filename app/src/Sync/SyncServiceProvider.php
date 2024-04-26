<?php

namespace SureCart\Sync;

use SureCart\Sync\Customers\CustomerSyncService;
use SureCart\Sync\Post\ProductPostSyncService;
use SureCart\Sync\Product\ProductSyncService;
use SureCart\Sync\Products\ProductsQueueProcess;
use SureCart\Sync\Products\ProductsSyncProcess;
use SureCart\Sync\Products\ProductsSyncService;
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

		// the product sync service.
		$container['surecart.sync.product'] = function ( $container ) {
			return new ProductSyncService( $container[ SURECART_APPLICATION_KEY ] );
		};

		// the products sync process.
		$container['surecart.process.products.sync'] = function() {
			return new ProductsSyncProcess();
		};

		// the products sync process.
		$container['surecart.process.product_post.sync'] = function() {
			return new ProductPostSyncService();
		};

		// the products queue process. Needs the sync process to be injected.
		$container['surecart.process.products.queue'] = function ( $container ) {
			return new ProductsQueueProcess( $container['surecart.process.products.sync'] );
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
	}
}

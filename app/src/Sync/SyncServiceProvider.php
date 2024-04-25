<?php

namespace SureCart\Sync;

use SureCart\Sync\Customers\CustomerSyncService;
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
		$container['surecart.sync.product'] = function () {
			return new ProductSyncService();
		};

		// the products sync service (bulk).
		$container['surecart.sync.products'] = function () {
			return new ProductsSyncService( new ProductsQueueProcess( new ProductsSyncProcess() ) );
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
		$container['surecart.sync.customers']->bootstrap();
	}
}

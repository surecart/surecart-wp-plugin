<?php

namespace SureCart\Sync;

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
		$container['surecart.sync'] = function () {
			return new SyncService();
		};

		// $container['surecart.sync.products.fetch'] = function () {
		// return new ProductFetchProcess();
		// };

		// $container['surecart.sync.products.process'] = function () {
		// return new ProductSyncProcess();
		// };

		$app = $container[ SURECART_APPLICATION_KEY ];
		$app->alias( 'sync', 'surecart.sync' );
	}

	/**
	 * Bootstrap any services if needed.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function bootstrap( $container ) {
		$container['surecart.sync']->bootstrap();
	}
}

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
		$container['surecart.sync.customers'] = function () {
			return new CustomerSyncService();
		};

		$container['surecart.sync.products'] = function () {
			return new ProductSyncService();
		};
	}

	/**
	 * Bootstrap any services if needed.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function bootstrap( $container ) {
		$container['surecart.sync.customers']->bootstrap();
		$container['surecart.sync.products']->bootstrap();
	}
}

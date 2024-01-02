<?php

namespace SureCart\Background;

use SureCart\Background\Migration\MigrationService;
use SureCart\Background\Migration\ModelFetchJob;
use SureCart\Background\Migration\ModelSyncJob;
use SureCartCore\ServiceProviders\ServiceProviderInterface;

/**
 * WordPress Users service.
 */
class MigrationServiceProvider implements ServiceProviderInterface {
	/**
	 * Register all dependencies in the IoC container.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function register( $container ) {
		$fetch                                       = new ModelFetchJob();
		$container['surecart.migration.model_fetch'] = function () use ( $fetch ) {
			return $fetch;
		};

		$sync                                       = new ModelSyncJob();
		$container['surecart.migration.model_sync'] = function () use ( $sync ) {
			return $sync;
		};

		$container['surecart.migration'] = function () use ( $container ) {
			return new MigrationService(
				$container['surecart.migration.model_fetch'],
				$container['surecart.migration.model_sync'],
			);
		};

		$app = $container[ SURECART_APPLICATION_KEY ];
		$app->alias( 'migration', 'surecart.migration' );
	}

	/**
	 * Bootstrap any services if needed.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function bootstrap( $container ) {
		$container['surecart.migration']->bootstrap();
	}
}

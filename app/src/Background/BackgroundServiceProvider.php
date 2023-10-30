<?php

namespace SureCart\Background;

use SureCartCore\ServiceProviders\ServiceProviderInterface;

/**
 * WordPress Users service.
 */
class BackgroundServiceProvider implements ServiceProviderInterface {
	/**
	 * Register all dependencies in the IoC container.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function register( $container ) {
		$container['surecart.sync'] = function () use ( $container ) {
			return new SyncService();
		};

		$container['surecart.queue'] = function () use ( $container ) {
			return new QueueService();
		};

		$container['surecart.async.webhooks'] = function() {
			return new AsyncWebhookService();
		};

		$app = $container[ SURECART_APPLICATION_KEY ];
		$app->alias( 'sync', 'surecart.sync' );
		$app->alias( 'queue', 'surecart.queue' );
		$app->alias( 'async', 'surecart.async.webhooks' );
	}

	/**
	 * Bootstrap any services if needed.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function bootstrap( $container ) {
		$container['surecart.sync']->customers()->bootstrap();
		$container['surecart.async.webhooks']->bootstrap();
	}
}

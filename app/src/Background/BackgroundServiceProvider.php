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

		$container['surecart.queue'] = function() {
			// Check if the action scheduler is imported, if not manually import it.
			if ( ! function_exists( 'as_schedule_single_action' ) ) {
				require_once SURECART_VENDOR_DIR . '/woocommerce/action-scheduler/action-scheduler.php';
			}

			return new QueueService();
		};

		$app = $container[ SURECART_APPLICATION_KEY ];
		$app->alias( 'sync', 'surecart.sync' );
		$app->alias( 'queue', 'surecart.queue' );
	}

	/**
	 * Bootstrap any services if needed.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function bootstrap( $container ) {
		$container['surecart.sync']->customers()->bootstrap();
		$container['surecart.queue']->bootstrap();
	}
}

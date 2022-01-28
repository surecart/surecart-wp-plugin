<?php

namespace CheckoutEngine\Webhooks;

use CheckoutEngineCore\ServiceProviders\ServiceProviderInterface;

/**
 * WordPress Users service.
 */
class WebhooksServiceProvider implements ServiceProviderInterface {
	/**
	 * Register all dependencies in the IoC container.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function register( $container ) {
		$container['checkout_engine.webhooks'] = function () use ( $container ) {
			return new WebhooksService( new WebhooksHistoryService() );
		};

		$app = $container[ CHECKOUT_ENGINE_APPLICATION_KEY ];
		$app->alias( 'webhooks', 'checkout_engine.webhooks' );
	}

	/**
	 * Bootstrap any services if needed.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function bootstrap( $container ) {
		if ( ! empty( $container['checkout_engine.webhooks'] ) ) {
			$container['checkout_engine.webhooks']->maybeCreateWebooks();
			$container['checkout_engine.webhooks']->listenForDomainChanges();
		}
	}
}

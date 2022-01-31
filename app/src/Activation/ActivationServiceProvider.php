<?php

namespace CheckoutEngine\Activation;

use CheckoutEngineCore\ServiceProviders\ServiceProviderInterface;

/**
 * Provide users dependencies.
 */
class ActivationServiceProvider implements ServiceProviderInterface {
	/**
	 * Register all dependencies in the IoC container.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function register( $container ) {
		$container['checkout_engine.activation'] = function ( $container ) {
			return new ActivationService( $container['checkout_engine.permissions.roles'], $container['checkout_engine.permissions.roles'] );
		};
	}

	/**
	 * Bootstrap any services if needed.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function bootstrap( $container ) {
		$container['checkout_engine.pages']->bootstrap();
	}
}

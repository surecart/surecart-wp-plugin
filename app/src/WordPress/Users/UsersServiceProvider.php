<?php

namespace CheckoutEngine\WordPress\Users;

use CheckoutEngineCore\ServiceProviders\ServiceProviderInterface;

/**
 * Provide users dependencies.
 */
class UsersServiceProvider implements ServiceProviderInterface {
	/**
	 * Register all dependencies in the IoC container.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function register( $container ) {
		$container['checkout_engine.users'] = function () {
			return new UsersService();
		};
	}

	/**
	 * Bootstrap any services if needed.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function bootstrap( $container ) {
		$container['checkout_engine.users']->bootstrap();
	}
}

<?php
namespace CheckoutEngine\Install;

use CheckoutEngineCore\ServiceProviders\ServiceProviderInterface;

class InstallServiceProvider implements ServiceProviderInterface {
	/**
	 * Register all dependencies in the IoC container.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function register( $container ) {
		$container['checkout_engine.install'] = function () {
			return new InstallService();
		};
	}


	/**
	 * Bootstrap any services if needed.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function bootstrap( $container ) {
		$container['checkout_engine.users']->register_rest_queries();
	}
}

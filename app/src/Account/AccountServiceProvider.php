<?php

namespace CheckoutEngine\Account;

use CheckoutEngineCore\ServiceProviders\ServiceProviderInterface;

/**
 * Provide users dependencies.
 */
class AccountServiceProvider implements ServiceProviderInterface {
	/**
	 * Register all dependencies in the IoC container.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function register( $container ) {
		$container['checkout_engine.account'] = function () {
			return new AccountService();
		};

		$app = $container[ CHECKOUT_ENGINE_APPLICATION_KEY ];
		$app->alias( 'account', 'checkout_engine.account' );
	}

	/**
	 * Bootstrap
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function bootstrap( $container ) {}
}

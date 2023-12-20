<?php

namespace SureCart\WordPress\Users;

use SureCartCore\ServiceProviders\ServiceProviderInterface;

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
		$container['surecart.users'] = function () {
			return new UsersService();
		};

		$app = $container[ SURECART_APPLICATION_KEY ];
		$app->alias( 'users', 'surecart.users' );
	}

	/**
	 * Bootstrap any services if needed.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function bootstrap( $container ) {
		$container['surecart.users']->bootstrap();
	}
}

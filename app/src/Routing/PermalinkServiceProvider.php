<?php

namespace SureCart\Routing;

use SureCartCore\ServiceProviders\ServiceProviderInterface;

/**
 * Provide custom route conditions.
 * This is an example class so feel free to modify or remove it.
 */
class PermalinkServiceProvider implements ServiceProviderInterface {
	/**
	 * Register all dependencies in the IoC container.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function register( $container ) {
		$container['surecart.permalink'] = function () {
			return new PermalinkService();
		};

		$app = $container[ SURECART_APPLICATION_KEY ];

		$app->alias( 'permalink', 'surecart.permalink' );
	}

	/**
	 * Bootstrap any services if needed.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function bootstrap( $container ) {
		// Nothing to bootstrap.
	}
}

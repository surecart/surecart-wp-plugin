<?php

namespace SureCart\WordPress\Cache;

use SureCartCore\ServiceProviders\ServiceProviderInterface;

/**
 * Cache Service Provider.
 */
class CacheServiceProvider implements ServiceProviderInterface {
	/**
	 * Holds the service container.
	 *
	 * @var \Pimple\Container
	 */
	protected $container;

	/**
	 * Register all dependencies in the container.
	 *
	 * @param  \Pimple\Container $container Service Container.
	 */
	public function register( $container ) {
		$container['surecart.litespeed_cache'] = function () {
			return new LiteSpeedCacheService();
		};
		$container['surecart.wpfastest_cache'] = function () {
			return new WpFastestCacheService();
		};

		$app = $container[ SURECART_APPLICATION_KEY ];

		$app->alias( 'litespeed_cache', 'surecart.litespeed_cache' );
		$app->alias( 'wpfastest_cache', 'surecart.wpfastest_cache' );
	}

	/**
	 * Bootstrap any services if needed.
	 *
	 * @param  \Pimple\Container $container Service Container.
	 */
	public function bootstrap( $container ) {
		$this->container = $container;
		$container['surecart.litespeed_cache']->bootstrap();
		$container['surecart.wpfastest_cache']->bootstrap();
	}
}

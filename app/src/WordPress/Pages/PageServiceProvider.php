<?php

namespace CheckoutEngine\WordPress\Pages;

use CheckoutEngineCore\ServiceProviders\ServiceProviderInterface;

/**
 * Provide users dependencies.
 */
class PageServiceProvider implements ServiceProviderInterface {
	/**
	 * Register all dependencies in the IoC container.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function register( $container ) {
		$container['checkout_engine.pages'] = function () {
			return new PageService();
		};

		$container['checkout_engine.pages.seeder'] = function ( $container ) {
			return new PageSeeder( $container['checkout_engine.forms'], $container['checkout_engine.pages'] );
		};

		$app = $container[ CHECKOUT_ENGINE_APPLICATION_KEY ];
		$app->alias( 'pages', 'checkout_engine.pages' );
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

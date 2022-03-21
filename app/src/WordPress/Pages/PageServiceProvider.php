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
		$container['surecart.pages'] = function () {
			return new PageService();
		};

		$container['surecart.pages.seeder'] = function ( $container ) {
			return new PageSeeder( $container['surecart.forms'], $container['surecart.pages'] );
		};

		$app = $container[ CHECKOUT_ENGINE_APPLICATION_KEY ];
		$app->alias( 'pages', 'surecart.pages' );
	}

	/**
	 * Bootstrap any services if needed.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function bootstrap( $container ) {
		$container['surecart.pages']->bootstrap();
	}
}

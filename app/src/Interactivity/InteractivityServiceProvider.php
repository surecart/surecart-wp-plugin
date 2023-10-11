<?php

namespace SureCart\Interactivity;

use SureCartCore\ServiceProviders\ServiceProviderInterface;

/**
 * Interactivity Service Provider
 */
class InteractivityServiceProvider implements ServiceProviderInterface {
	/**
	 * Register all dependencies in the IoC container.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function register( $container ) {
		$store = [];

		$containerp['surecart.interactivity'] = function( $c ) use ( $store ) {
			return new InitialState( $store );
		};

		$app = $container[ SURECART_APPLICATION_KEY ];
		$app->alias( 'templates', 'surecart.templates' );
	}

	/**
	 * Bootstrap the service.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function bootstrap( $container ) {
		$container['surecart.interactivity']->bootstrap();
	}
}

<?php

namespace CheckoutEngine\WordPress;

use CheckoutEngine\WordPress\PluginService;
use CheckoutEngineCore\ServiceProviders\ServiceProviderInterface;

/**
 * Register plugin options.
 */
class PluginServiceProvider implements ServiceProviderInterface {
	/**
	 * Register all dependencies in the IoC container.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function register( $container ) {
		$app = $container[ SURECART_APPLICATION_KEY ];

		$container['surecart.plugin'] = function( $c ) {
			return new PluginService( $c[ SURECART_APPLICATION_KEY ] );
		};

		$app = $container[ SURECART_APPLICATION_KEY ];
		$app->alias( 'plugin', 'surecart.plugin' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function bootstrap( $container ) {
		/** Nothing to bootstrap */
	}

	/**
	 * Load textdomain.
	 *
	 * @return void
	 */
	public function loadTextdomain() {
		load_plugin_textdomain( 'surecart', false, basename( dirname( SURECART_PLUGIN_FILE ) ) . DIRECTORY_SEPARATOR . 'languages' );
	}
}

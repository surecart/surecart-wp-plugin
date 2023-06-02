<?php

namespace SureCart\WordPress;

use SureCart\WordPress\PluginService;
use SureCartCore\ServiceProviders\ServiceProviderInterface;

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
		$container['surecart.plugin'] = function( $c ) {
			return new PluginService( $c[ SURECART_APPLICATION_KEY ] );
		};

		$container['surecart.actions'] = function() {
			return new ActionsService();
		};
		$container['surecart.config.setting'] = function($c) {
			return json_decode(json_encode($c[SURECART_CONFIG_KEY]));
		};

		$app = $container[ SURECART_APPLICATION_KEY ];
		$app->alias( 'plugin', 'surecart.plugin' );
		$app->alias( 'actions', 'surecart.actions' );
		$app->alias( 'config', 'surecart.config.setting' );
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

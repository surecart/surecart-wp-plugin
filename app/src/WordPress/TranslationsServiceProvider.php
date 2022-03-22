<?php

namespace SureCart\WordPress;

use SureCartCore\ServiceProviders\ServiceProviderInterface;

/**
 * Register translations.
 */
class TranslationsServiceProvider implements ServiceProviderInterface {
	/**
	 * Register all dependencies in the IoC container.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function register( $container ) {
		// Nothing to register.
	}

	/**
	 * Bootstrap the service.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function bootstrap( $container ) {
		add_action( 'load_script_textdomain_relative_path', [ $this, 'scriptsPath' ], 10, 2 );
		add_action( 'init', [ $this, 'loadPluginTextDomain' ], 0 );
	}

	 /**
	  * This is needed for Loco translate to work properly.
	  */
	public function loadPluginTextDomain() {
		load_plugin_textdomain( 'surecart', false, dirname( plugin_basename( SURECART_PLUGIN_FILE ) ) . '/languages/' );
	}

	public function scriptsPath( $path, $src ) {
		if ( strpos( $path, 'surecart.esm.js' ) !== false ) {
			return 'components/custom-elements/index.js';
		}

		// the rest.
		if ( strpos( $src, 'dist' ) !== false && strpos( $src, 'surecart' ) !== false ) {
			return str_replace( 'dist/', '', $path );
		}

		return $path;
	}
}

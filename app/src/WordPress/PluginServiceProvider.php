<?php

namespace CheckoutEngine\WordPress;

use WPEmerge\ServiceProviders\ServiceProviderInterface;

/**
 * Register plugin options.
 */
class PluginServiceProvider implements ServiceProviderInterface {

	/**
	 * {@inheritDoc}
	 */
	public function register( $container ) {
		// Nothing to register.
	}

	/**
	 * {@inheritDoc}
	 */
	public function bootstrap( $container ) {
		register_activation_hook( CHECKOUT_ENGINE_PLUGIN_FILE, [ $this, 'activate' ] );
		register_deactivation_hook( CHECKOUT_ENGINE_PLUGIN_FILE, [ $this, 'deactivate' ] );

		add_action( 'plugins_loaded', [ $this, 'loadTextdomain' ] );
	}

	/**
	 * Plugin activation.
	 *
	 * @return void
	 */
	public function activate() {
		// Nothing to do right now.
	}

	/**
	 * Plugin deactivation.
	 *
	 * @return void
	 */
	public function deactivate() {
		// Nothing to do right now.
	}

	/**
	 * Load textdomain.
	 *
	 * @return void
	 */
	public function loadTextdomain() {
		load_plugin_textdomain( 'checkout_engine', false, basename( dirname( CHECKOUT_ENGINE_PLUGIN_FILE ) ) . DIRECTORY_SEPARATOR . 'languages' );
	}
}

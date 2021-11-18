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
		$container['checkout_engine.install'] = function () {
			return new InstallService();
		};

		$container['checkout_engine.pages'] = function () {
			return new PageService();
		};

		$app = $container[ WPEMERGE_APPLICATION_KEY ];

		$app->alias( 'pages', 'checkout_engine.pages' );

		// install alias.
		$app->alias(
			'install',
			function () use ( $container ) {
				return call_user_func_array( [ $container['checkout_engine.install'], 'install' ], func_get_args() );
			}
		);
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
		\CheckoutEngine::createRoles();
		\CheckoutEngine::install();
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

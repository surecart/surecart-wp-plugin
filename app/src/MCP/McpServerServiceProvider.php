<?php

namespace SureCart\MCP;

use SureCart\Controllers\Admin\Settings\MCPSettings;
use SureCartCore\ServiceProviders\ServiceProviderInterface;

/**
 * Service provider for MCP (Model Context Protocol) integration.
 *
 * Handles AJAX handlers for MCP adapter plugin install/activate.
 * The MCP adapter plugin's default server automatically exposes
 * all abilities registered via wp_register_ability().
 */
class McpServerServiceProvider implements ServiceProviderInterface {

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
		// Register AJAX handlers for MCP adapter install/activate on admin.
		if ( is_admin() ) {
			MCPSettings::registerAjaxHandlers();
		}
	}
}

<?php

namespace SureCart\MCP;

use SureCart\Controllers\Admin\Settings\MCPSettings;
use SureCart\Models\ApiToken;
use SureCartCore\ServiceProviders\ServiceProviderInterface;

/**
 * Service provider that registers the SureCart MCP server endpoint
 * and AJAX handlers for MCP adapter plugin management.
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
		// Always register AJAX handlers for MCP adapter install/activate on admin.
		if ( is_admin() ) {
			MCPSettings::registerAjaxHandlers();
		}

		// Only register the MCP server endpoint if the setting is enabled.
		if ( ! get_option( 'surecart_mcp_server_enabled', false ) ) {
			return;
		}

		// Don't register if the store is not connected.
		if ( empty( ApiToken::get() ) ) {
			return;
		}

		// Register the MCP REST route.
		add_action( 'rest_api_init', array( $this, 'register_mcp_route' ) );
	}

	/**
	 * Register the MCP REST route.
	 *
	 * @return void
	 */
	public function register_mcp_route() {
		// Check if the MCP Adapter plugin provides the transport class.
		if ( ! class_exists( 'Jetwp\MCP_Adapter\MCP_REST_Transport' ) && ! class_exists( 'MCP_REST_Transport' ) ) {
			return;
		}

		$transport_class = class_exists( 'Jetwp\MCP_Adapter\MCP_REST_Transport' )
			? 'Jetwp\MCP_Adapter\MCP_REST_Transport'
			: 'MCP_REST_Transport';

		$transport = new $transport_class(
			array(
				'namespace' => 'surecart/v1',
				'route'     => '/mcp',
			)
		);

		$transport->register_routes();
	}
}

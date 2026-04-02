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
		$transport_class = $this->get_transport_class();

		if ( ! $transport_class ) {
			return;
		}

		$transport = new $transport_class(
			array(
				'namespace' => 'surecart/v1',
				'route'     => '/mcp',
			)
		);

		$transport->register_routes();
	}

	/**
	 * Get the MCP transport class if available.
	 *
	 * The MCP Adapter plugin namespace has changed across versions,
	 * so we check multiple possible class names.
	 *
	 * @return string|false The transport class name or false if not available.
	 */
	private function get_transport_class() {
		$possible_classes = array(
			'WP\\MCP\\Transport\\HttpTransport',         // v0.4+ (current).
			'Jetwp\\MCP_Adapter\\MCP_REST_Transport',    // Legacy namespace.
			'MCP_REST_Transport',                         // Fallback.
		);

		foreach ( $possible_classes as $class ) {
			if ( class_exists( $class ) ) {
				return $class;
			}
		}

		return false;
	}
}

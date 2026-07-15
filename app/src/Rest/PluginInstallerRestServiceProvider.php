<?php

namespace SureCart\Rest;

use SureCart\Controllers\Rest\PluginInstallerController;
use SureCart\Rest\RestServiceInterface;

/**
 * Service provider for the integration plugin installer endpoint.
 */
class PluginInstallerRestServiceProvider extends RestServiceProvider implements RestServiceInterface {
	/**
	 * Rest Controller
	 *
	 * @var string
	 */
	protected $controller = PluginInstallerController::class;

	/**
	 * Register Additional REST Routes
	 *
	 * @return void
	 */
	public function registerModelRoutes() {
		// Install and activate a catalog integration's plugin from GitHub.
		register_rest_route(
			"$this->name/v$this->version",
			'integration_plugin_install',
			[
				[
					'methods'             => \WP_REST_Server::CREATABLE,
					'callback'            => $this->callback( $this->controller, 'install' ),
					'permission_callback' => [ $this, 'install_permission_check' ],
					'args'                => [
						'id' => [
							'description'       => esc_html__( 'The integration catalog id to install.', 'surecart' ),
							'type'              => 'integer',
							'required'          => true,
							'sanitize_callback' => 'absint',
						],
					],
				],
			]
		);
	}

	/**
	 * Install permissions.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 *
	 * @return true|\WP_Error True if the request can install plugins, WP_Error otherwise.
	 */
	public function install_permission_check( $request ) {
		if ( ! current_user_can( 'install_plugins' ) ) {
			return new \WP_Error(
				'sc_insufficient_permissions',
				__( 'You do not have permission to install plugins.', 'surecart' ),
				[ 'status' => 403 ]
			);
		}

		return true;
	}
}

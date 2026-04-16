<?php

namespace SureCart\Controllers\Admin\Settings;

/**
 * MCP (Model Context Protocol) settings helper.
 *
 * Exposes AJAX handlers for install/activate of the MCP Adapter plugin and
 * the data required by the client-side MCP settings tab (localized via the
 * main Settings controller).
 */
class MCPSettings {
	/**
	 * The MCP Adapter plugin slug.
	 *
	 * @var string
	 */
	const MCP_ADAPTER_SLUG = 'mcp-adapter/mcp-adapter.php';

	/**
	 * The MCP Adapter GitHub download URL.
	 * Also referenced in MCPAdapterNotice.js for the manual download fallback — keep in sync.
	 *
	 * @var string
	 */
	const MCP_ADAPTER_DOWNLOAD_URL = 'https://github.com/WordPress/mcp-adapter/releases/latest/download/mcp-adapter.zip';

	/**
	 * The MCP Adapter GitHub repository URL.
	 *
	 * @var string
	 */
	const MCP_ADAPTER_REPO_URL = 'https://github.com/WordPress/mcp-adapter';

	/**
	 * Get the data required by the client-side MCP settings tab.
	 *
	 * Called from the main Settings controller to localize `scMCPData` on
	 * the shared settings script (the MCP tab no longer has its own entry).
	 *
	 * @return array
	 */
	public static function getLocalizedData() {
		if ( ! function_exists( 'get_plugins' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}

		$all_plugins  = get_plugins();
		$is_installed = isset( $all_plugins[ self::MCP_ADAPTER_SLUG ] );
		$is_active    = is_plugin_active( self::MCP_ADAPTER_SLUG );

		return [
			'mcp_adapter_installed'    => $is_installed,
			'mcp_adapter_active'       => $is_active,
			'mcp_adapter_download_url' => self::MCP_ADAPTER_DOWNLOAD_URL,
			'mcp_adapter_repo_url'     => self::MCP_ADAPTER_REPO_URL,
			'ajax_url'                 => admin_url( 'admin-ajax.php' ),
			'nonce'                    => wp_create_nonce( 'sc_mcp_adapter_action' ),
			'site_url'                 => site_url(),
			'rest_url'                 => rest_url( 'mcp/mcp-adapter-default-server' ),
			'app_passwords_url'        => admin_url( 'profile.php#application-passwords-section' ),
			'wp_version'               => get_bloginfo( 'version' ),
			'abilities_api_available'  => function_exists( 'wp_register_ability_category' ),
			'current_username'         => wp_get_current_user()->user_login,
		];
	}

	/**
	 * Register AJAX handlers for MCP adapter install/activate.
	 *
	 * @return void
	 */
	public static function registerAjaxHandlers() {
		add_action( 'wp_ajax_sc_mcp_adapter_install', [ __CLASS__, 'ajaxInstall' ] );
		add_action( 'wp_ajax_sc_mcp_adapter_activate', [ __CLASS__, 'ajaxActivate' ] );
	}

	/**
	 * AJAX handler to install the MCP Adapter plugin from GitHub.
	 *
	 * @return void
	 */
	public static function ajaxInstall() {
		check_ajax_referer( 'sc_mcp_adapter_action', 'nonce' );

		if ( ! current_user_can( 'install_plugins' ) ) {
			wp_send_json_error( [ 'message' => __( 'You do not have permission to install plugins.', 'surecart' ) ] );
		}

		require_once ABSPATH . 'wp-admin/includes/file.php';
		require_once ABSPATH . 'wp-admin/includes/plugin-install.php';
		require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';
		require_once ABSPATH . 'wp-admin/includes/plugin.php';

		// Don't reinstall if already present.
		$all_plugins = get_plugins();
		if ( isset( $all_plugins[ self::MCP_ADAPTER_SLUG ] ) ) {
			// Already installed — just try to activate.
			$activate = activate_plugin( self::MCP_ADAPTER_SLUG );
			if ( is_wp_error( $activate ) ) {
				wp_send_json_error( [ 'message' => $activate->get_error_message() ] );
			}
			wp_send_json_success(
				[
					'installed' => true,
					'activated' => true,
					'message'   => __( 'MCP Adapter activated successfully.', 'surecart' ),
				]
			);
		}

		// Use a silent skin to suppress output.
		$skin     = new \WP_Ajax_Upgrader_Skin();
		$upgrader = new \Plugin_Upgrader( $skin );
		$result   = $upgrader->install( self::MCP_ADAPTER_DOWNLOAD_URL );

		if ( is_wp_error( $result ) ) {
			wp_send_json_error( [ 'message' => $result->get_error_message() ] );
		}

		if ( is_wp_error( $skin->result ) ) {
			wp_send_json_error( [ 'message' => $skin->result->get_error_message() ] );
		}

		if ( ! $result ) {
			wp_send_json_error( [ 'message' => __( 'Plugin installation failed.', 'surecart' ) ] );
		}

		// Auto-activate after install.
		$activate = activate_plugin( self::MCP_ADAPTER_SLUG );
		if ( is_wp_error( $activate ) ) {
			// Installed but activation failed — still report install success.
			wp_send_json_success(
				[
					'installed' => true,
					'activated' => false,
					'message'   => __( 'Plugin installed but activation failed. Please activate it manually.', 'surecart' ),
				]
			);
		}

		wp_send_json_success(
			[
				'installed' => true,
				'activated' => true,
				'message'   => __( 'MCP Adapter installed and activated successfully.', 'surecart' ),
			]
		);
	}

	/**
	 * AJAX handler to activate the MCP Adapter plugin.
	 *
	 * @return void
	 */
	public static function ajaxActivate() {
		check_ajax_referer( 'sc_mcp_adapter_action', 'nonce' );

		if ( ! current_user_can( 'activate_plugins' ) ) {
			wp_send_json_error( [ 'message' => __( 'You do not have permission to activate plugins.', 'surecart' ) ] );
		}

		if ( ! function_exists( 'get_plugins' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}

		$activate = activate_plugin( self::MCP_ADAPTER_SLUG );
		if ( is_wp_error( $activate ) ) {
			wp_send_json_error( [ 'message' => $activate->get_error_message() ] );
		}

		wp_send_json_success(
			[
				'activated' => true,
				'message'   => __( 'MCP Adapter activated successfully.', 'surecart' ),
			]
		);
	}
}

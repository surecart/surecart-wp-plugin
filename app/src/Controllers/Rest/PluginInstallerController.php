<?php

namespace SureCart\Controllers\Rest;

use SureCart\Models\IntegrationCatalog;
use SureCart\Support\GitHubInstaller;

/**
 * Installs and activates a GitHub-sourced integration plugin through the REST API.
 *
 * The download URL is taken from the integration catalog record and validated by
 * GitHubInstaller before it is handed to WordPress' Plugin_Upgrader.
 */
class PluginInstallerController {
	/**
	 * Install (and activate) the plugin for a catalog integration.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return array|\WP_Error
	 */
	public function install( \WP_REST_Request $request ) {
		$id = absint( $request['id'] );

		if ( ! $id ) {
			return new \WP_Error( 'sc_invalid_request', __( 'A valid integration id is required.', 'surecart' ), [ 'status' => 400 ] );
		}

		// Respect sites that lock down file modifications.
		if ( defined( 'DISALLOW_FILE_MODS' ) && DISALLOW_FILE_MODS ) {
			return new \WP_Error(
				'sc_file_mods_disabled',
				__( 'Plugin installation is disabled on this site (DISALLOW_FILE_MODS).', 'surecart' ),
				[ 'status' => 403 ]
			);
		}

		$record = IntegrationCatalog::find( $id );
		if ( is_wp_error( $record ) ) {
			return $record;
		}

		// Validate the download URL through the GitHub allow-list gate.
		$zip = GitHubInstaller::resolveZipUrl( $this->getDownloadUrl( $record ) );
		if ( is_wp_error( $zip ) ) {
			return $zip;
		}

		require_once ABSPATH . 'wp-admin/includes/file.php';
		require_once ABSPATH . 'wp-admin/includes/plugin-install.php';
		require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';
		require_once ABSPATH . 'wp-admin/includes/plugin.php';

		$plugin_file = $this->getPluginFile( $record );

		if ( empty( $plugin_file ) ) {
			return new \WP_Error(
				'sc_invalid_plugin_file',
				__( 'This integration does not have an installable plugin file.', 'surecart' ),
				[ 'status' => 400 ]
			);
		}

		// Already installed — skip install and go straight to activation.
		$installed = get_plugins();
		if ( isset( $installed[ $plugin_file ] ) ) {
			return $this->activate( $plugin_file );
		}

		// Use a silent skin to suppress upgrader output.
		$skin     = new \WP_Ajax_Upgrader_Skin();
		$upgrader = new \Plugin_Upgrader( $skin );
		$result   = $upgrader->install( $zip );

		// Load-bearing dual error check — the upgrader can fail via either channel.
		if ( is_wp_error( $result ) ) {
			return $result;
		}
		if ( is_wp_error( $skin->result ) ) {
			return $skin->result;
		}
		if ( ! $result ) {
			return new \WP_Error( 'sc_install_failed', __( 'Plugin installation failed.', 'surecart' ), [ 'status' => 500 ] );
		}

		return $this->activate( $plugin_file, $upgrader );
	}

	/**
	 * Activate the plugin, falling back to the upgrader's discovered main file.
	 *
	 * @param string                $plugin_file The expected plugin main file path.
	 * @param \Plugin_Upgrader|null $upgrader    The upgrader used to install, for main-file discovery.
	 *
	 * @return array
	 */
	protected function activate( $plugin_file, $upgrader = null ) {
		$activate = activate_plugin( $plugin_file );

		// The catalog path may not match the zip contents — retry with the real main file.
		if ( is_wp_error( $activate ) && $upgrader ) {
			$discovered = $upgrader->plugin_info();
			if ( ! empty( $discovered ) && $discovered !== $plugin_file ) {
				$activate = activate_plugin( $discovered );
			}
		}

		if ( is_wp_error( $activate ) ) {
			return [
				'installed' => true,
				'activated' => false,
				'message'   => __( 'Plugin installed but activation failed. Activate it from the Plugins screen.', 'surecart' ),
			];
		}

		return [
			'installed' => true,
			'activated' => true,
			'message'   => __( 'Installed and activated.', 'surecart' ),
		];
	}

	/**
	 * Read the download URL from the catalog record.
	 *
	 * Backed by IntegrationCatalog::getDownloadUrlAttribute(), which returns the
	 * acf download_url or null.
	 *
	 * @param \SureCart\Models\IntegrationCatalog $record The integration catalog record.
	 *
	 * @return string
	 */
	protected function getDownloadUrl( $record ) {
		return (string) ( $record->download_url ?? '' );
	}

	/**
	 * Read the plugin main file from the catalog record.
	 *
	 * @param \SureCart\Models\IntegrationCatalog $record The integration catalog record.
	 *
	 * @return string
	 */
	protected function getPluginFile( $record ) {
		$plugin_file = $record->plugin_file;
		if ( ! empty( $plugin_file ) ) {
			return (string) $plugin_file;
		}

		return (string) ( $record->acf['plugin_file'] ?? '' );
	}
}

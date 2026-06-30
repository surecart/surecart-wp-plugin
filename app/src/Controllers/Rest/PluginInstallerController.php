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
		$id = absint( $request->get_param( 'id' ) );

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

		// WP HTTP follows redirects on download without re-checking the host, so
		// scope two filters that close the loopback/internal SSRF vector and
		// re-validate every redirect hop against the GitHub allow-list. Both only
		// act on the streamed download chain (identified by $args['filename'], which
		// download_url() sets and WP preserves across redirect hops), so unrelated
		// HTTP fired by other hooks during this window passes through untouched.
		// Removed in finally so they never leak to other requests.
		add_filter( 'http_request_args', [ $this, 'rejectUnsafeDownloadUrls' ], 10, 1 );
		add_filter( 'pre_http_request', [ $this, 'guardDownloadHost' ], 10, 3 );
		try {
			$result = $upgrader->install( $zip );
		} finally {
			remove_filter( 'http_request_args', [ $this, 'rejectUnsafeDownloadUrls' ], 10 );
			remove_filter( 'pre_http_request', [ $this, 'guardDownloadHost' ], 10 );
		}

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
	 * Lives on the acf payload — there is no top-level plugin_file attribute.
	 *
	 * @param \SureCart\Models\IntegrationCatalog $record The integration catalog record.
	 *
	 * @return string
	 */
	protected function getPluginFile( $record ) {
		return (string) ( ( $record->acf ?? [] )['plugin_file'] ?? '' );
	}

	/**
	 * Force WP HTTP to reject internal/loopback URLs for the plugin download.
	 *
	 * Closes the SSRF vector where a redirect points at a private or loopback
	 * address. Only touches the streamed download chain ($args['filename'] is set
	 * by download_url() and preserved across redirect hops); any other request in
	 * the install window is left as-is.
	 *
	 * @param array $args The http request args.
	 *
	 * @return array
	 */
	public function rejectUnsafeDownloadUrls( $args ) {
		if ( ! empty( $args['filename'] ) ) {
			$args['reject_unsafe_urls'] = true;
		}
		return $args;
	}

	/**
	 * Re-validate each download hop host against the GitHub allow-list.
	 *
	 * WP HTTP follows redirects without re-checking the host. This fires on every
	 * hop of the streamed download (identified by $args['filename'], which WP keeps
	 * across redirect hops) during the scoped install and aborts the request if the
	 * target host is not allow-listed. Non-download requests in the window — and
	 * allowed download hosts — return $preempt unchanged so they proceed normally.
	 *
	 * @param false|array|\WP_Error $preempt Short-circuit response, false to proceed.
	 * @param array                 $args    The http request args.
	 * @param string                $url     The request URL.
	 *
	 * @return false|array|\WP_Error
	 */
	public function guardDownloadHost( $preempt, $args, $url ) {
		// Only police the plugin download chain; leave other outbound HTTP alone.
		if ( empty( $args['filename'] ) ) {
			return $preempt;
		}

		$host = wp_parse_url( $url, PHP_URL_HOST );

		if ( empty( $host ) || ! GitHubInstaller::isAllowedHost( $host ) ) {
			return new \WP_Error(
				'sc_invalid_host',
				__( 'The plugin download was redirected to a host that is not allowed.', 'surecart' ),
				[ 'status' => 400 ]
			);
		}

		return $preempt;
	}
}

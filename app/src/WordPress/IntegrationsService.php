<?php
/**
 * Integrations service.
 *
 * @package   SureCartAppCore
 * @author    SureCart <support@surecart.com>
 * @copyright  SureCart
 * @license   https://www.gnu.org/licenses/gpl-2.0.html GPL-2.0
 * @link      https://surecart.com
 */

namespace SureCart\WordPress;

/**
 * Main communication channel with the theme.
 */
class IntegrationsService {

	/**
	 * All Integrations with slugs as key & plugin file as value.
	 *
	 * @var array
	 */
	public $integrations = [
		'suretriggers' => 'suretriggers/suretriggers.php',
	];

	/**
	 * Bootstrap the plugin.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_action( 'wp_ajax_surecart_plugin_install', 'wp_ajax_install_plugin' );
		add_action( 'wp_ajax_surecart_plugin_activate', 'wp_ajax_activate_plugin' );
	}

	/**
	 * Get the plugin status.
	 *
	 * @param string $plugin_init_file Plugin init file.
	 *
	 * @return string
	 */
	public function getPluginStatus( $plugin_init_file ) {
		$installed_plugins = get_plugins();

		if ( ! isset( $installed_plugins[ $plugin_init_file ] ) ) {
			return 'install';
		}

		if ( ! is_plugin_active( $plugin_init_file ) ) {
			return 'installed';
		}

		if ( ! $this->isPluginConfigured( $plugin_init_file ) ) {
			return 'configure';
		}

		return 'activated';
	}

	/**
	 * Check if the plugin is configured.
	 *
	 * @param string $plugin_init_file Plugin init file.
	 *
	 * @return boolean
	 */
	public function isPluginConfigured( $plugin_init_file ) {
		switch ( $plugin_init_file ) {
			case 'suretriggers/suretriggers.php':
				if ( class_exists( '\SureTriggers\Controllers\OptionController' ) ) {
					$st_key = \SureTriggers\Controllers\OptionController::get_option( 'secret_key' );
					return $st_key && 'connection-denied' !== $st_key;
				}
				return false;
		}

		return true;
	}

	/**
	 * Get all integrations.
	 *
	 * @return array
	 */
	public function getAllIntegrations() {
		if ( empty( $this->integrations ) || ! is_array( $this->integrations ) ) {
			return [];
		}

		$all_integrations = [];
		foreach ( $this->integrations as $slug => $plugin_file ) {
			$all_integrations[ $slug ] = [
				'slug'     => $slug,
				'status'   => $this->getPluginStatus( $plugin_file ),
				'file'     => $plugin_file,
				'logo'     => esc_url_raw( trailingslashit( plugin_dir_url( SURECART_PLUGIN_FILE ) ) . 'images/integrations/suretriggers-logo.svg' ),
				'logoText' => esc_url_raw( trailingslashit( plugin_dir_url( SURECART_PLUGIN_FILE ) ) . 'images/integrations/suretriggers-logo-text.svg' ),
				'banner'   => esc_url_raw( trailingslashit( plugin_dir_url( SURECART_PLUGIN_FILE ) ) . 'images/integrations/suretriggers-banner.svg' ),

			];
		}

		return $all_integrations;
	}
}

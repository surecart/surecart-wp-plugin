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

use SureCartCore\Application\Application;

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
		add_action( 'wp_ajax_surecart_recommended_plugin_install', 'wp_ajax_install_plugin' );
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
		} elseif ( is_plugin_active( $plugin_init_file ) ) {
			if ( ! $this->isPluginConfigured( $plugin_init_file ) ) {
				return 'configure';
			}
			return 'activated';
		} else {
			return 'installed';
		}
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
				'slug'   => $slug,
				'status' => $this->getPluginStatus( $plugin_file ),
				'file'   => $plugin_file,
			];
		}

		return $all_integrations;
	}
}

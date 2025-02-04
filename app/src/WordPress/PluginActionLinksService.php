<?php
/**
 * Plugin Action Links service.
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
class PluginActionLinksService {
	/**
	 * Application instance.
	 *
	 * @var Application
	 */
	protected $app = null;

	/**
	 * Constructor.
	 *
	 * @param Application $app Application instance.
	 */
	public function __construct( $app ) {
		$this->app = $app;
	}

	/**
	 * Bootstrap the plugin.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_filter( 'network_admin_plugin_action_links_surecart/surecart.php', array( $this, 'addPluginActionLinks' ) );
		add_filter( 'plugin_action_links_surecart/surecart.php', array( $this, 'addPluginActionLinks' ) );
	}

	/**
	 * Add plugin action links.
	 *
	 * @param array $actions Plugin actions.
	 * @return array
	 */
	public function addPluginActionLinks( $actions ) {
		return array_merge(
			array(
				'settings' => '<a href="' . admin_url( 'admin.php?page=sc-settings' ) . '">' . __( 'Settings', 'surecart' ) . '</a>',
				'docs'     => '<a href="https://surecart.com/docs" target="_blank">' . __( 'Documentation', 'surecart' ) . '</a>',
				'upgrade'  => '<a href="https://app.surecart.com/billing" target="_blank">' . __( 'Upgrade', 'surecart' ) . '</a>',
			),
			$actions
		);
	}
}

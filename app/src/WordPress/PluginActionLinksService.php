<?php

namespace SureCart\WordPress;

use SureCartCore\Application\Application;

/**
 * Plugin Action Links service.
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
				'settings' => '<a href="' . esc_url( admin_url( 'admin.php?page=sc-settings' ) ) . '">' . esc_html__( 'Settings', 'surecart' ) . '</a>',
				'docs'     => '<a href="https://surecart.com/docs" target="_blank">' . esc_html__( 'Documentation', 'surecart' ) . '</a>',
			),
			$actions
		);
	}
}

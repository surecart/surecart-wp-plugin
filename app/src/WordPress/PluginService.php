<?php
/**
 * @package   SureCartAppCore
 * @author    Andre Gagnon <me@andregagnon.me>
 * @copyright  Andre Gagnon
 * @license   https://www.gnu.org/licenses/gpl-2.0.html GPL-2.0
 * @link      https://surecart.com
 */

namespace SureCart\WordPress;

use SureCartCore\Application\Application;

/**
 * Main communication channel with the theme.
 */
class PluginService {
	/**
	 * Application instance.
	 *
	 * @var Application
	 */
	protected $app = null;

	/**
	 * Constructor.
	 *
	 * @param Application $app
	 */
	public function __construct( $app ) {
		$this->app = $app;
	}

	/**
	 * Shortcute to \SureCart\Account\AccountService
	 *
	 * @return \SureCart\Account\AccountService
	 */
	public function account() {
		return $this->app->reolve( 'surecart.account' );
	}

	/**
	 * Shortcut to \SureCart\Install\InstallService.
	 *
	 * @return \SureCart\Install\InstallService
	 */
	public function install() {
		return $this->app->resolve( 'surecart.install' );
	}

	/**
	 * Shortcut to \SureCart\WordPress\Pages\PageService.
	 *
	 * @return \SureCart\WordPress\Pages\PageService
	 */
	public function pages() {
		return $this->app->resolve( 'surecart.pages' );
	}
	/**
	 * Shortcut to \SureCart\WordPress\Pages\PageService.
	 *
	 * @return \SureCart\WordPress\Pages\PageService
	 */
	public function activation() {
		return $this->app->resolve( 'surecart.activation' );
	}

	/**
	 * Shortcut to \SureCart\WordPress\Pages\PageService.
	 *
	 * @return \SureCart\Permissions\RolesService;
	 */
	public function roles() {
		return $this->app->resolve( 'surecart.permissions.roles' );
	}
}

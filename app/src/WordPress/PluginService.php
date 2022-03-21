<?php
/**
 * @package   CheckoutEngineAppCore
 * @author    Andre Gagnon <me@andregagnon.me>
 * @copyright  Andre Gagnon
 * @license   https://www.gnu.org/licenses/gpl-2.0.html GPL-2.0
 * @link      https://checkoutengine.com
 */

namespace CheckoutEngine\WordPress;

use CheckoutEngineCore\Application\Application;

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
	 * Shortcute to \CheckoutEngine\Account\AccountService
	 *
	 * @return \CheckoutEngine\Account\AccountService
	 */
	public function account() {
		return $this->app->reolve( 'checkout_engine.account' );
	}

	/**
	 * Shortcut to \CheckoutEngine\Install\InstallService.
	 *
	 * @return \CheckoutEngine\Install\InstallService
	 */
	public function install() {
		return $this->app->resolve( 'checkout_engine.install' );
	}

	/**
	 * Shortcut to \CheckoutEngine\WordPress\Pages\PageService.
	 *
	 * @return \CheckoutEngine\WordPress\Pages\PageService
	 */
	public function pages() {
		return $this->app->resolve( 'checkout_engine.pages' );
	}
	/**
	 * Shortcut to \CheckoutEngine\WordPress\Pages\PageService.
	 *
	 * @return \CheckoutEngine\WordPress\Pages\PageService
	 */
	public function activation() {
		return $this->app->resolve( 'checkout_engine.activation' );
	}

	/**
	 * Shortcut to \CheckoutEngine\WordPress\Pages\PageService.
	 *
	 * @return \CheckoutEngine\Permissions\RolesService;
	 */
	public function roles() {
		return $this->app->resolve( 'checkout_engine.permissions.roles' );
	}
}

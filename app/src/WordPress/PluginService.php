<?php
/**
 * @package   CheckoutEngineAppCore
 * @author    Andre Gagnon <me@andregagnon.me>
 * @copyright  Andre Gagnon
 * @license   https://www.gnu.org/licenses/gpl-2.0.html GPL-2.0
 * @link      https://checkoutengine.com
 */

namespace CheckoutEngineAppCore\AppCore;

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
	 * Shortcut to \CheckoutEngine\Install\InstallService.
	 *
	 * @return \CheckoutEngineAppCore\Assets\Assets
	 */
	public function install() {
		return $this->app->resolve( 'checkout_engine.install' );
	}

	/**
	 * Shortcut to \CheckoutEngineAppCore\Sidebar\Sidebar.
	 *
	 * @return \CheckoutEngineAppCore\Sidebar\Sidebar
	 */
	public function pages() {
		return $this->app->resolve( 'checkout_engine_app_core.sidebar.sidebar' );
	}
}

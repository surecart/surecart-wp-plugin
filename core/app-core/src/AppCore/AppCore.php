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
class AppCore {
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
	 * Shortcut to \CheckoutEngineAppCore\Assets\Assets.
	 *
	 * @return \CheckoutEngineAppCore\Assets\Assets
	 */
	public function assets() {
		return $this->app->resolve( 'surecart_app_core.assets.assets' );
	}

	/**
	 * Shortcut to \CheckoutEngineAppCore\Avatar\Avatar.
	 *
	 * @return \CheckoutEngineAppCore\Avatar\Avatar
	 */
	public function avatar() {
		return $this->app->resolve( 'surecart_app_core.avatar.avatar' );
	}

	/**
	 * Shortcut to \CheckoutEngineAppCore\Config\Config.
	 *
	 * @return \CheckoutEngineAppCore\Config\Config
	 */
	public function config() {
		return $this->app->resolve( 'surecart_app_core.config.config' );
	}

	/**
	 * Shortcut to \CheckoutEngineAppCore\Image\Image.
	 *
	 * @return \CheckoutEngineAppCore\Image\Image
	 */
	public function image() {
		return $this->app->resolve( 'surecart_app_core.image.image' );
	}

	/**
	 * Shortcut to \CheckoutEngineAppCore\Sidebar\Sidebar.
	 *
	 * @return \CheckoutEngineAppCore\Sidebar\Sidebar
	 */
	public function sidebar() {
		return $this->app->resolve( 'surecart_app_core.sidebar.sidebar' );
	}
}

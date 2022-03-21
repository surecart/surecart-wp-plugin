<?php
/**
 * @package   SureCartAppCore
 * @author    Andre Gagnon <me@andregagnon.me>
 * @copyright  Andre Gagnon
 * @license   https://www.gnu.org/licenses/gpl-2.0.html GPL-2.0
 * @link      https://SureCart.com
 */

namespace SureCartAppCore\Sidebar;

use SureCartCore\ServiceProviders\ServiceProviderInterface;

/**
 * Provide sidebar dependencies.
 *
 * @codeCoverageIgnore
 */
class SidebarServiceProvider implements ServiceProviderInterface {
	/**
	 * {@inheritDoc}
	 */
	public function register( $container ) {
		$container['surecart_app_core.sidebar.sidebar'] = function() {
			return new Sidebar();
		};
	}

	/**
	 * {@inheritDoc}
	 */
	public function bootstrap( $container ) {
		// Nothing to bootstrap.
	}
}

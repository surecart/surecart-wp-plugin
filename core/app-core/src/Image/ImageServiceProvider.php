<?php
/**
 * @package   SureCartAppCore
 * @author    Andre Gagnon <me@andregagnon.me>
 * @copyright  Andre Gagnon
 * @license   https://www.gnu.org/licenses/gpl-2.0.html GPL-2.0
 * @link      https://surecart.com
 */

namespace SureCartAppCore\Image;

use SureCartCore\ServiceProviders\ServiceProviderInterface;

/**
 * Provide image dependencies.
 *
 * @codeCoverageIgnore
 */
class ImageServiceProvider implements ServiceProviderInterface {
	/**
	 * {@inheritDoc}
	 */
	public function register( $container ) {
		$container['surecart_app_core.image.image'] = function() {
			return new Image();
		};
	}

	/**
	 * {@inheritDoc}
	 */
	public function bootstrap( $container ) {
		// Nothing to bootstrap.
	}
}

<?php
/**
 * @package   CheckoutEngineAppCore
 * @author    Andre Gagnon <hi@atanas.dev>
 * @copyright  Andre Gagnon
 * @license   https://www.gnu.org/licenses/gpl-2.0.html GPL-2.0
 * @link      https://checkoutengine.com
 */

namespace CheckoutEngineAppCore\Assets;

use CheckoutEngineCore\ServiceProviders\ServiceProviderInterface;

/**
 * Provide assets dependencies.
 *
 * @codeCoverageIgnore
 */
class AssetsServiceProvider implements ServiceProviderInterface {
	/**
	 * {@inheritDoc}
	 */
	public function register( $container ) {
		$container['checkout_engine_app_core.assets.manifest'] = function( $c ) {
			return new Manifest( $c[ CHECKOUT_ENGINE_CONFIG_KEY ]['app_core']['path'] );
		};

		$container['checkout_engine_app_core.assets.assets'] = function( $container ) {
			return new Assets(
				$container[ CHECKOUT_ENGINE_CONFIG_KEY ]['app_core']['path'],
				$container[ CHECKOUT_ENGINE_CONFIG_KEY ]['app_core']['url'],
				$container['checkout_engine_app_core.config.config'],
				$container['checkout_engine_app_core.assets.manifest']
			);
		};
	}

	/**
	 * {@inheritDoc}
	 */
	public function bootstrap( $container ) {
		// Nothing to bootstrap.
	}
}

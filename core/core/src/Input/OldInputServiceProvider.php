<?php
/**
 * @package   CheckoutEngineCore
 * @author    Andre Gagnon <hi@atanas.dev>
 * @copyright 2017-2019 Andre Gagnon
 * @license   https://www.gnu.org/licenses/gpl-2.0.html GPL-2.0
 * @link      https://checkout_engine.com/
 */

namespace CheckoutEngineCore\Input;

use CheckoutEngineCore\ServiceProviders\ServiceProviderInterface;

/**
 * Provide old input dependencies.
 *
 * @codeCoverageIgnore
 */
class OldInputServiceProvider implements ServiceProviderInterface {
	/**
	 * {@inheritDoc}
	 */
	public function register( $container ) {
		$container[ CHECKOUT_ENGINE_OLD_INPUT_KEY ] = function ( $c ) {
			return new OldInput( $c[ CHECKOUT_ENGINE_FLASH_KEY ] );
		};

		$container[ OldInputMiddleware::class ] = function ( $c ) {
			return new OldInputMiddleware( $c[ CHECKOUT_ENGINE_OLD_INPUT_KEY ] );
		};

		$app = $container[ CHECKOUT_ENGINE_APPLICATION_KEY ];
		$app->alias( 'oldInput', CHECKOUT_ENGINE_OLD_INPUT_KEY );
	}

	/**
	 * {@inheritDoc}
	 */
	public function bootstrap( $container ) {
		// Nothing to bootstrap.
	}
}

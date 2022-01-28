<?php
/**
 * @package   CheckoutEngineCore
 * @author    Andre Gagnon <me@andregagnon.me>
 * @copyright 2017-2019 Andre Gagnon
 * @license   https://www.gnu.org/licenses/gpl-2.0.html GPL-2.0
 * @link      https://checkout_engine.com/
 */

namespace CheckoutEngineCore\Flash;

use CheckoutEngineCore\ServiceProviders\ServiceProviderInterface;

/**
 * Provide flash dependencies.
 *
 * @codeCoverageIgnore
 */
class FlashServiceProvider implements ServiceProviderInterface {
	/**
	 * {@inheritDoc}
	 */
	public function register( $container ) {
		$container[ CHECKOUT_ENGINE_FLASH_KEY ] = function ( $c ) {
			$session = null;
			if ( isset( $c[ CHECKOUT_ENGINE_SESSION_KEY ] ) ) {
				$session = &$c[ CHECKOUT_ENGINE_SESSION_KEY ];
			} elseif ( isset( $_SESSION ) ) {
				$session = &$_SESSION;
			}
			return new Flash( $session );
		};

		$container[ FlashMiddleware::class ] = function ( $c ) {
			return new FlashMiddleware( $c[ CHECKOUT_ENGINE_FLASH_KEY ] );
		};

		$app = $container[ CHECKOUT_ENGINE_APPLICATION_KEY ];
		$app->alias( 'flash', CHECKOUT_ENGINE_FLASH_KEY );
	}

	/**
	 * {@inheritDoc}
	 */
	public function bootstrap( $container ) {
		// Nothing to bootstrap.
	}
}

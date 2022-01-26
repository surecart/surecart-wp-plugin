<?php
/**
 * @package   CheckoutEngineCore
 * @author    Andre Gagnon <hi@atanas.dev>
 * @copyright 2017-2019 Andre Gagnon
 * @license   https://www.gnu.org/licenses/gpl-2.0.html GPL-2.0
 * @link      https://checkout_engine.com/
 */

namespace CheckoutEngineCore\Middleware;

use CheckoutEngineCore\ServiceProviders\ServiceProviderInterface;

/**
 * Provide middleware dependencies.
 *
 * @codeCoverageIgnore
 */
class MiddlewareServiceProvider implements ServiceProviderInterface {
	/**
	 * {@inheritDoc}
	 */
	public function register( $container ) {
		$container[ UserLoggedOutMiddleware::class ] = function ( $c ) {
			return new UserLoggedOutMiddleware( $c[ CHECKOUT_ENGINE_RESPONSE_SERVICE_KEY ] );
		};

		$container[ UserLoggedInMiddleware::class ] = function ( $c ) {
			return new UserLoggedInMiddleware( $c[ CHECKOUT_ENGINE_RESPONSE_SERVICE_KEY ] );
		};

		$container[ UserCanMiddleware::class ] = function ( $c ) {
			return new UserCanMiddleware( $c[ CHECKOUT_ENGINE_RESPONSE_SERVICE_KEY ] );
		};
	}

	/**
	 * {@inheritDoc}
	 */
	public function bootstrap( $container ) {
		// Nothing to bootstrap.
	}
}

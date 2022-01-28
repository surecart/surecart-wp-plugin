<?php
/**
 * @package   CheckoutEngineCore
 * @author    Andre Gagnon <me@andregagnon.me>
 * @copyright 2017-2019 Andre Gagnon
 * @license   https://www.gnu.org/licenses/gpl-2.0.html GPL-2.0
 * @link      https://checkout_engine.com/
 */

namespace CheckoutEngineCore\Routing;

use CheckoutEngineCore\Exceptions\ConfigurationException;
use CheckoutEngineCore\Support\Arr;

/**
 * Allow objects to have routes
 */
trait HasRoutesTrait {
	/**
	 * Array of registered routes
	 *
	 * @var RouteInterface[]
	 */
	protected $routes = [];

	/**
	 * Get routes.
	 *
	 * @codeCoverageIgnore
	 * @return RouteInterface[]
	 */
	public function getRoutes() {
		return $this->routes;
	}

	/**
	 * Add a route.
	 *
	 * @param  RouteInterface $route
	 * @return void
	 */
	public function addRoute( RouteInterface $route ) {
		$routes = $this->getRoutes();
		$name   = $route->getAttribute( 'name' );

		if ( in_array( $route, $routes, true ) ) {
			throw new ConfigurationException( 'Attempted to register a route twice.' );
		}

		if ( $name !== '' ) {
			foreach ( $routes as $registered ) {
				if ( $name === $registered->getAttribute( 'name' ) ) {
					throw new ConfigurationException( "The route name \"$name\" is already registered." );
				}
			}
		}

		$this->routes[] = $route;
	}

	/**
	 * Remove a route.
	 *
	 * @param  RouteInterface $route
	 * @return void
	 */
	public function removeRoute( RouteInterface $route ) {
		$routes = $this->getRoutes();

		$index = array_search( $route, $routes, true );

		if ( $index === false ) {
			return;
		}

		$this->routes = array_values( Arr::except( $routes, $index ) );
	}
}

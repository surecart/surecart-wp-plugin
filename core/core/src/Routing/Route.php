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
use CheckoutEngineCore\Helpers\HasAttributesTrait;
use CheckoutEngineCore\Requests\RequestInterface;
use CheckoutEngineCore\Routing\Conditions\ConditionInterface;

/**
 * Represent a route
 */
class Route implements RouteInterface, HasQueryFilterInterface {
	use HasAttributesTrait;
	use HasQueryFilterTrait;

	/**
	 * {@inheritDoc}
	 */
	public function isSatisfied( RequestInterface $request ) {
		$methods   = $this->getAttribute( 'methods', [] );
		$condition = $this->getAttribute( 'condition' );

		if ( ! in_array( $request->getMethod(), $methods ) ) {
			return false;
		}

		if ( ! $condition instanceof ConditionInterface ) {
			throw new ConfigurationException( 'Route does not have a condition.' );
		}

		return $condition->isSatisfied( $request );
	}

	/**
	 * {@inheritDoc}
	 */
	public function getArguments( RequestInterface $request ) {
		$condition = $this->getAttribute( 'condition' );

		if ( ! $condition instanceof ConditionInterface ) {
			throw new ConfigurationException( 'Route does not have a condition.' );
		}

		return $condition->getArguments( $request );
	}
}

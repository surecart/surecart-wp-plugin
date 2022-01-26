<?php
/**
 * @package   CheckoutEngineCore
 * @author    Andre Gagnon <hi@atanas.dev>
 * @copyright 2017-2019 Andre Gagnon
 * @license   https://www.gnu.org/licenses/gpl-2.0.html GPL-2.0
 * @link      https://checkout_engine.com/
 */

namespace CheckoutEngineCore\Application;

use Pimple\Container;
use CheckoutEngineCore\Exceptions\ClassNotFoundException;

/**
 * Generic class instance factory.
 */
class GenericFactory {
	/**
	 * Container.
	 *
	 * @var Container
	 */
	protected $container = null;

	/**
	 * Constructor.
	 *
	 * @codeCoverageIgnore
	 * @param Container $container
	 */
	public function __construct( Container $container ) {
		$this->container = $container;
	}

	/**
	 * Make a class instance.
	 *
	 * @throws ClassNotFoundException
	 * @param  string $class
	 * @return object
	 */
	public function make( $class ) {
		if ( isset( $this->container[ $class ] ) ) {
			return $this->container[ $class ];
		}

		if ( ! class_exists( $class ) ) {
			throw new ClassNotFoundException( 'Class not found: ' . $class );
		}

		return new $class();
	}
}

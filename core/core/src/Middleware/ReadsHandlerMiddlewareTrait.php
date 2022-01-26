<?php
/**
 * @package   CheckoutEngineCore
 * @author    Andre Gagnon <hi@atanas.dev>
 * @copyright 2017-2019 Andre Gagnon
 * @license   https://www.gnu.org/licenses/gpl-2.0.html GPL-2.0
 * @link      https://checkout_engine.com/
 */

namespace CheckoutEngineCore\Middleware;

use CheckoutEngineCore\Helpers\Handler;

/**
 * Describes how a request is handled.
 */
trait ReadsHandlerMiddlewareTrait {
	/**
	 * Get middleware registered with the given handler.
	 *
	 * @param  Handler $handler
	 * @return string[]
	 */
	protected function getHandlerMiddleware( Handler $handler ) {
		$instance = $handler->make();

		if ( ! $instance instanceof HasControllerMiddlewareInterface ) {
			return [];
		}

		return $instance->getMiddleware( $handler->get()['method'] );
	}
}

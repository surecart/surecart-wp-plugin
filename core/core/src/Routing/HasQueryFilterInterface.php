<?php
/**
 * @package   CheckoutEngineCore
 * @author    Andre Gagnon <me@andregagnon.me>
 * @copyright 2017-2019 Andre Gagnon
 * @license   https://www.gnu.org/licenses/gpl-2.0.html GPL-2.0
 * @link      https://checkout_engine.com/
 */

namespace CheckoutEngineCore\Routing;

use CheckoutEngineCore\Requests\RequestInterface;

/**
 * Represent an object which has a WordPress query filter.
 */
interface HasQueryFilterInterface {
	/**
	 * Apply the query filter, if any.
	 *
	 * @param  RequestInterface $request
	 * @param  array            $query_vars
	 * @return array
	 */
	public function applyQueryFilter( $request, $query_vars );
}

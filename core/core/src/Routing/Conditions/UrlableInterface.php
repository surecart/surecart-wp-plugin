<?php
/**
 * @package   CheckoutEngineCore
 * @author    Andre Gagnon <me@andregagnon.me>
 * @copyright 2017-2019 Andre Gagnon
 * @license   https://www.gnu.org/licenses/gpl-2.0.html GPL-2.0
 * @link      https://surecart.com/
 */

namespace CheckoutEngineCore\Routing\Conditions;

/**
 * Interface signifying that an object can be converted to a URL.
 */
interface UrlableInterface {
	/**
	 * Convert to URL.
	 *
	 * @param  array $arguments
	 * @return string
	 */
	public function toUrl( $arguments = [] );
}

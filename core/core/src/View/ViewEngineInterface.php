<?php
/**
 * @package   CheckoutEngineCore
 * @author    Andre Gagnon <hi@atanas.dev>
 * @copyright 2017-2019 Andre Gagnon
 * @license   https://www.gnu.org/licenses/gpl-2.0.html GPL-2.0
 * @link      https://checkout_engine.com/
 */

namespace CheckoutEngineCore\View;

/**
 * Interface that view engines must implement
 */
interface ViewEngineInterface extends ViewFinderInterface {
	/**
	 * Create a view instance from the first view name that exists.
	 *
	 * @param  string[] $views
	 * @return ViewInterface
	 */
	public function make( $views );
}

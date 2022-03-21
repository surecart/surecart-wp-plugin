<?php
/**
 * @package   CheckoutEngineCore
 * @author    Andre Gagnon <me@andregagnon.me>
 * @copyright 2017-2019 Andre Gagnon
 * @license   https://www.gnu.org/licenses/gpl-2.0.html GPL-2.0
 * @link      https://surecart.com/
 */

namespace CheckoutEngineCore\Flash;

use Closure;
use CheckoutEngineCore\Requests\RequestInterface;

/**
 * Store current request data and clear old request data
 */
class FlashMiddleware {
	/**
	 * Flash service.
	 *
	 * @var Flash
	 */
	protected $flash = null;

	/**
	 * Constructor.
	 *
	 * @codeCoverageIgnore
	 * @param Flash $flash
	 */
	public function __construct( Flash $flash ) {
		$this->flash = $flash;
	}

	/**
	 * {@inheritDoc}
	 */
	public function handle( RequestInterface $request, Closure $next ) {
		$response = $next( $request );

		if ( $this->flash->enabled() ) {
			$this->flash->shift();
			$this->flash->save();
		}

		return $response;
	}
}

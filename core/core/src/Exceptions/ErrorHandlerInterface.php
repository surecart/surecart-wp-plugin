<?php
/**
 * @package   CheckoutEngineCore
 * @author    Andre Gagnon <me@andregagnon.me>
 * @copyright 2017-2019 Andre Gagnon
 * @license   https://www.gnu.org/licenses/gpl-2.0.html GPL-2.0
 * @link      https://checkout_engine.com/
 */

namespace CheckoutEngineCore\Exceptions;

use Exception as PhpException;
use Psr\Http\Message\ResponseInterface;
use CheckoutEngineCore\Requests\RequestInterface;

interface ErrorHandlerInterface {
	/**
	 * Register any necessary error, exception and shutdown handlers.
	 *
	 * @return void
	 */
	public function register();

	/**
	 * Unregister any registered error, exception and shutdown handlers.
	 *
	 * @return void
	 */
	public function unregister();

	/**
	 * Get a response representing the specified exception.
	 *
	 * @param  RequestInterface $request
	 * @param  PhpException     $exception
	 * @return ResponseInterface
	 */
	public function getResponse( RequestInterface $request, PhpException $exception );
}

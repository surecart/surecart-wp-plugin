<?php
/**
 * @package   CheckoutEngineCore
 * @author    Andre Gagnon <hi@atanas.dev>
 * @copyright 2017-2019 Andre Gagnon
 * @license   https://www.gnu.org/licenses/gpl-2.0.html GPL-2.0
 * @link      https://checkout_engine.com/
 */

namespace CheckoutEngineCore\Kernels;

use Closure;
use Psr\Http\Message\ResponseInterface;
use CheckoutEngineCore\Helpers\Handler;
use CheckoutEngineCore\Middleware\HasMiddlewareDefinitionsInterface;
use CheckoutEngineCore\Requests\RequestInterface;

/**
 * Describes how a request is handled.
 */
interface HttpKernelInterface extends HasMiddlewareDefinitionsInterface {
	/**
	 * Bootstrap the kernel.
	 *
	 * @return void
	 */
	public function bootstrap();

	/**
	 * Run a response pipeline for the given request.
	 *
	 * @param  RequestInterface       $request
	 * @param  string[]               $middleware
	 * @param  string|Closure|Handler $handler
	 * @param  array                  $arguments
	 * @return ResponseInterface
	 */
	public function run( RequestInterface $request, $middleware, $handler, $arguments = [] );

	/**
	 * Return a response for the given request.
	 *
	 * @param  RequestInterface $request
	 * @param  array            $arguments
	 * @return ResponseInterface|null
	 */
	public function handle( RequestInterface $request, $arguments = [] );
}

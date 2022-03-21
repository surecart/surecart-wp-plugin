<?php
/**
 * @package   SureCartCore
 * @author    Andre Gagnon <me@andregagnon.me>
 * @copyright 2017-2019 Andre Gagnon
 * @license   https://www.gnu.org/licenses/gpl-2.0.html GPL-2.0
 * @link      https://surecart.com/
 */

namespace SureCartCore\Responses;

use Psr\Http\Message\ResponseInterface;

interface ResponsableInterface {
	/**
	 * Convert to Psr\Http\Message\ResponseInterface.
	 *
	 * @return ResponseInterface
	 */
	public function toResponse();
}

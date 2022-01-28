<?php
/**
 * @package   CheckoutEngineAppCore
 * @author    Andre Gagnon <me@andregagnon.me>
 * @copyright  Andre Gagnon
 * @license   https://www.gnu.org/licenses/gpl-2.0.html GPL-2.0
 * @link      https://checkoutengine.com
 */

namespace CheckoutEngineAppCore\Assets;

use CheckoutEngineCore\Helpers\MixedType;
use CheckoutEngineAppCore\Concerns\JsonFileNotFoundException;
use CheckoutEngineAppCore\Concerns\ReadsJsonTrait;

class Manifest {
	use ReadsJsonTrait {
		load as traitLoad;
	}

	/**
	 * App root path.
	 *
	 * @var string
	 */
	protected $path = '';

	/**
	 * Constructor.
	 *
	 * @param string $path
	 */
	public function __construct( $path ) {
		$this->path = $path;
	}

	/**
	 * {@inheritDoc}
	 */
	protected function getJsonPath() {
		return MixedType::normalizePath( $this->path . DIRECTORY_SEPARATOR . 'dist' . DIRECTORY_SEPARATOR . 'manifest.json' );
	}

	/**
	 * {@inheritDoc}
	 */
	protected function load( $file ) {
		try {
			return $this->traitLoad( $file );
		} catch ( JsonFileNotFoundException $e ) {
			// We used to throw an exception here but it just causes confusion for new users.
		}

		return [];
	}
}

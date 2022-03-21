<?php
/**
 * @package   CheckoutEngineCore
 * @author    Andre Gagnon <me@andregagnon.me>
 * @copyright 2017-2019 Andre Gagnon
 * @license   https://www.gnu.org/licenses/gpl-2.0.html GPL-2.0
 * @link      https://surecart.com/
 */

namespace CheckoutEngineCore\Application;

use CheckoutEngineCore\Helpers\HandlerFactory;
use CheckoutEngineCore\Helpers\MixedType;
use CheckoutEngineCore\ServiceProviders\ExtendsConfigTrait;
use CheckoutEngineCore\ServiceProviders\ServiceProviderInterface;

/**
 * Provide application dependencies.
 *
 * @codeCoverageIgnore
 */
class ApplicationServiceProvider implements ServiceProviderInterface {
	use ExtendsConfigTrait;

	/**
	 * {@inheritDoc}
	 */
	public function register( $container ) {
		$this->extendConfig( $container, 'providers', [] );

		$upload_dir = wp_upload_dir();
		$cache_dir  = MixedType::addTrailingSlash( $upload_dir['basedir'] ) . 'surecart' . DIRECTORY_SEPARATOR . 'cache';
		$this->extendConfig(
			$container,
			'cache',
			[
				'path' => $cache_dir,
			]
		);

		$container[ CHECKOUT_ENGINE_APPLICATION_GENERIC_FACTORY_KEY ] = function ( $c ) {
			return new GenericFactory( $c );
		};

		$container[ CHECKOUT_ENGINE_APPLICATION_CLOSURE_FACTORY_KEY ] = function ( $c ) {
			return new ClosureFactory( $c[ CHECKOUT_ENGINE_APPLICATION_GENERIC_FACTORY_KEY ] );
		};

		$container[ CHECKOUT_ENGINE_HELPERS_HANDLER_FACTORY_KEY ] = function ( $c ) {
			return new HandlerFactory( $c[ CHECKOUT_ENGINE_APPLICATION_GENERIC_FACTORY_KEY ] );
		};

		$app = $container[ CHECKOUT_ENGINE_APPLICATION_KEY ];
		$app->alias( 'app', CHECKOUT_ENGINE_APPLICATION_KEY );
		$app->alias( 'closure', CHECKOUT_ENGINE_APPLICATION_CLOSURE_FACTORY_KEY );
	}

	/**
	 * {@inheritDoc}
	 */
	public function bootstrap( $container ) {
		$cache_dir = $container[ CHECKOUT_ENGINE_CONFIG_KEY ]['cache']['path'];
		wp_mkdir_p( $cache_dir );
	}
}

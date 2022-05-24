<?php

namespace SureCart\WordPress\Assets;

use SureCartCore\ServiceProviders\ServiceProviderInterface;

/**
 * Register and enqueues assets.
 */
class AssetsServiceProvider implements ServiceProviderInterface {
	/**
	 * Holds the service container
	 *
	 * @var \Pimple\Container
	 */
	protected $container;

	/**
	 * {@inheritDoc}
	 *
	 * @param  \Pimple\Container $container Service Container.
	 */
	public function register( $container ) {
		$container['surecart.assets'] = function () use ( $container ) {
			return new AssetsService( new BlockAssetsLoadService(), new ScriptsService( $container ), new StylesService( $container ) );
		};

		$app = $container[ SURECART_APPLICATION_KEY ];

		$app->alias( 'assets', 'surecart.assets' );
	}

	/**
	 * {@inheritDoc}
	 *
	 * @param  \Pimple\Container $container Service Container.
	 */
	public function bootstrap( $container ) {
		$this->container = $container;
		$container['surecart.assets']->bootstrap();
	}
}

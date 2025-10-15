<?php

namespace SureCart\Integrations\Etch;

use SureCartCore\ServiceProviders\ServiceProviderInterface;

/**
 * Handles the Etch integration.
 */
class EtchServiceProvider implements ServiceProviderInterface {
	/**
	 * Register all dependencies in the IoC container.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function register( $container ) {
		$container['surecart.plugins.etch'] = function () {
			return new EtchService();
		};
	}

	/**
	 * {@inheritDoc}
	 *
	 * @param \Pimple\Container $container Service Container.
	 */
	public function bootstrap( $container ) {
		$container['surecart.plugins.etch']->bootstrap();
	}
}

<?php

namespace SureCart\Integrations\Avada;

use SureCartCore\ServiceProviders\ServiceProviderInterface;

/**
 * Handles the Avada integration.
 */
class AvadaServiceProvider implements ServiceProviderInterface {
	/**
	 * Register all dependencies in the IoC container.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function register( $container ) {
		$container['surecart.plugins.avada'] = function () {
			return new AvadaService();
		};
	}

	/**
	 * {@inheritDoc}
	 *
	 * @param \Pimple\Container $container Service Container.
	 */
	public function bootstrap( $container ) {
		$container['surecart.plugins.avada']->bootstrap();
	}
}

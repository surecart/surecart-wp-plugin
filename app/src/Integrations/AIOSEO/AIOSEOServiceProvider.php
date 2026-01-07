<?php

namespace SureCart\Integrations\AIOSEO;

use SureCartCore\ServiceProviders\ServiceProviderInterface;

/**
 * Handles the All in One SEO integration.
 */
class AIOSEOServiceProvider implements ServiceProviderInterface {
	/**
	 * Register all dependencies in the IoC container.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function register( $container ) {
		$container['surecart.plugins.aioseo'] = function () {
			return new AIOSEOService();
		};
	}

	/**
	 * {@inheritDoc}
	 *
	 * @param \Pimple\Container $container Service Container.
	 */
	public function bootstrap( $container ) {
		$container['surecart.plugins.aioseo']->bootstrap();
	}
}

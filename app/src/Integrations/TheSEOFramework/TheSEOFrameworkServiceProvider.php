<?php

namespace SureCart\Integrations\TheSEOFramework;

use SureCartCore\ServiceProviders\ServiceProviderInterface;

/**
 * Handles The SEO Framework integration.
 */
class TheSEOFrameworkServiceProvider implements ServiceProviderInterface {
	/**
	 * Register all dependencies in the IoC container.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function register( $container ) {
		$container['surecart.plugins.the_seo_framework'] = function () {
			return new TheSEOFrameworkService();
		};
	}

	/**
	 * {@inheritDoc}
	 *
	 * @param \Pimple\Container $container Service Container.
	 */
	public function bootstrap( $container ) {
		$container['surecart.plugins.the_seo_framework']->bootstrap();
	}
}

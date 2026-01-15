<?php

namespace SureCart\Integrations\SEOPress;

use SureCartCore\ServiceProviders\ServiceProviderInterface;

/**
 * Handles the SEOPress integration.
 */
class SEOPressServiceProvider implements ServiceProviderInterface {
	/**
	 * Register all dependencies in the IoC container.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function register( $container ) {
		$container['surecart.plugins.seopress'] = function () {
			return new SEOPressService();
		};
	}

	/**
	 * {@inheritDoc}
	 *
	 * @param \Pimple\Container $container Service Container.
	 */
	public function bootstrap( $container ) {
		$container['surecart.plugins.seopress']->bootstrap();
	}
}

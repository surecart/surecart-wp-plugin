<?php

namespace SureCart\Integrations\Yoast;

use SureCartCore\ServiceProviders\ServiceProviderInterface;

/**
 * Handles the Yoast SEO integration.
 */
class YoastServiceProvider implements ServiceProviderInterface {
	/**
	 * Register all dependencies in the IoC container.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function register( $container ) {
		$container['surecart.plugins.yoast'] = function () {
			return new YoastService();
		};
	}

	/**
	 * {@inheritDoc}
	 *
	 * @param \Pimple\Container $container Service Container.
	 */
	public function bootstrap( $container ) {
		$container['surecart.plugins.yoast']->bootstrap();
	}
}

<?php

namespace SureCart\StickyPurchase;

use SureCartCore\ServiceProviders\ServiceProviderInterface;

/**
 * Provides the sticky purchase service.
 */
class StickyPurchaseServiceProvider implements ServiceProviderInterface {
	/**
	 * Register all dependencies in the IoC container.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function register( $container ) {
		$container['surecart.sticky.purchase'] = function () {
			return new StickyPurchaseService();
		};
	}

	/**
	 * Bootstrap any services if needed.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function bootstrap( $container ) {
		$container['surecart.sticky.purchase']->bootstrap();
	}
}

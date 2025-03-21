<?php

namespace SureCart\ProductQuickView;

use SureCartCore\ServiceProviders\ServiceProviderInterface;

/**
 * Provides the product quick view service.
 */
class ProductQuickViewServiceProvider implements ServiceProviderInterface {
	/**
	 * Register all dependencies in the IoC container.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function register( $container ) {
		$container['surecart.product.quick.view'] = function () {
			return new ProductQuickViewService();
		};

		$app = $container[ SURECART_APPLICATION_KEY ];
		$app->alias( 'productQuickView', 'surecart.product.quick.view' );
	}

	/**
	 * Bootstrap any services if needed.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function bootstrap( $container ) {
		$container['surecart.product.quick.view']->bootstrap();
	}
}

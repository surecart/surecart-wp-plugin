<?php

namespace SureCart\Cart;

use SureCartCore\ServiceProviders\ServiceProviderInterface;

/**
 * Provides the cart service.
 */
class CartServiceProvider implements ServiceProviderInterface {
	/**
	 * Register all dependencies in the IoC container.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function register( $container ) {
		$container['surecart.cart'] = function ( $container ) {
			return new CartService();
		};
	}

	/**
	 * Bootstrap any services if needed.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function bootstrap( $container ) {
		$container['surecart.cart']->bootstrap();
	}
}

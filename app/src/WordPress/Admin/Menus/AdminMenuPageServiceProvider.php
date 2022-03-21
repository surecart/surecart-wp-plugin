<?php

namespace CheckoutEngine\WordPress\Admin\Menus;

use CheckoutEngineCore\ServiceProviders\ServiceProviderInterface;

/**
 * Register plugin options.
 */
class AdminMenuPageServiceProvider implements ServiceProviderInterface {
	/**
	 * Register all dependencies in the IoC container.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function register( $container ) {
		$container['surecart.admin.menus'] = function () {
			return new AdminMenuPageService();
		};
	}

	/**
	 * Bootstrap any services if needed.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function bootstrap( $container ) {
		$container['surecart.admin.menus']->bootstrap();
	}
}

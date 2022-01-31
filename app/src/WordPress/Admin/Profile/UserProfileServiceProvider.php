<?php

namespace CheckoutEngine\WordPress\Admin\Profile;

use CheckoutEngineCore\ServiceProviders\ServiceProviderInterface;

/**
 * Register plugin options.
 */
class UserProfileServiceProvider implements ServiceProviderInterface {
	/**
	 * Register all dependencies in the IoC container.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function register( $container ) {
		$container['checkout_engine.admin.profile'] = function () {
			return new UserProfileService();
		};
	}

	/**
	 * Bootstrap any services if needed.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function bootstrap( $container ) {
		$container['checkout_engine.admin.profile']->bootstrap();
	}
}

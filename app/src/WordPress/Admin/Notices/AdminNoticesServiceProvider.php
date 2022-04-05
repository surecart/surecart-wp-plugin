<?php

namespace SureCart\WordPress\Admin\Notices;

use SureCartCore\ServiceProviders\ServiceProviderInterface;

/**
 * Register plugin options.
 */
class AdminNoticesServiceProvider implements ServiceProviderInterface {
	/**
	 * Register all dependencies in the IoC container.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function register( $container ) {
		$container['surecart.admin.notices'] = function () {
			return new AdminNoticesService();
		};


		$app = $container[ SURECART_APPLICATION_KEY ];
		$app->alias( 'notices', 'surecart.admin.notices' );
	}

	/**
	 * Bootstrap any services if needed.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function bootstrap( $container ) {
		$container['surecart.admin.notices']->bootstrap();
	}
}

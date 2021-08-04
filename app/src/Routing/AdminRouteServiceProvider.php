<?php

namespace CheckoutEngine\Routing;

use CheckoutEngine\Routing\AdminRouteService;
use WPEmerge\ServiceProviders\ServiceProviderInterface;

/**
 * Provide custom route conditions.
 * This is an example class so feel free to modify or remove it.
 */
class AdminRouteServiceProvider implements ServiceProviderInterface {
	/**
	 * {@inheritDoc}
	 */
	public function register( $container ) {
		$container['checkout_engine.admin.route'] = function () {
			return new AdminRouteService();
		};

		$app = $container[ WPEMERGE_APPLICATION_KEY ];

		// register_setting alias.
		$app->alias(
			'getEditUrl',
			function () use ( $container ) {
				return call_user_func_array( [ $container['checkout_engine.admin.route'], 'getEditUrl' ], func_get_args() );
			}
		);
	}

	/**
	 * {@inheritDoc}
	 */
	public function bootstrap( $container ) {
		// Nothing to bootstrap.
	}
}

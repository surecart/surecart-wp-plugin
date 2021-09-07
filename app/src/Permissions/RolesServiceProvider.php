<?php

namespace CheckoutEngine\Permissions;

use CheckoutEngine\Permissions\RolesService;
use WPEmerge\ServiceProviders\ServiceProviderInterface;

/**
 * Handles the request service
 */
class RolesServiceProvider implements ServiceProviderInterface {
	/**
	 * {@inheritDoc}
	 *
	 *  @param  \Pimple\Container $container Service Container.
	 */
	public function register( $container ) {
		$container['checkout_engine.permissions.roles'] = function () {
			return new RolesService();
		};

		$app = $container[ WPEMERGE_APPLICATION_KEY ];

		// register_setting alias.
		$app->alias(
			'createRoles',
			function () use ( $container ) {
				return call_user_func_array( [ $container['checkout_engine.permissions.roles'], 'createRoles' ], func_get_args() );
			}
		);
	}

	/**
	 * {@inheritDoc}
	 *
	 * @param  \Pimple\Container $container Service Container.
	 *
	 * @return void
	 *
	 * phpcs:disable Generic.CodeAnalysis.UnusedFunctionParameter
	 */
	public function bootstrap( $container ) {
	}
}

<?php

namespace CheckoutEngine\Permissions;

use CheckoutEngine\Models\Charge;
use CheckoutEngine\Models\Subscription;
use CheckoutEngine\Models\User;
use CheckoutEngine\Permissions\RolesService;
use CheckoutEngineCore\ServiceProviders\ServiceProviderInterface;

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
		$container['surecart.permissions.roles'] = function () {
			return new RolesService();
		};

		$container['surecart.permissions.permissions'] = function () {
			return new PermissionsService();
		};
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
		$container['surecart.permissions.permissions']->bootstrap();
	}
}

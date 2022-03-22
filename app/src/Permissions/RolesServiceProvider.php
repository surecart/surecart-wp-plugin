<?php

namespace SureCart\Permissions;

use SureCart\Models\Charge;
use SureCart\Models\Subscription;
use SureCart\Models\User;
use SureCart\Permissions\RolesService;
use SureCartCore\ServiceProviders\ServiceProviderInterface;

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

<?php

namespace SureCart\Permissions;

use SureCart\Permissions\RolesService;
use SureCart\Permissions\AdminAccessService;
use SureCartCore\ServiceProviders\ServiceProviderInterface;

/**
 * Handles the request service
 */
class PermissionsServiceProvider implements ServiceProviderInterface {
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

		$container['surecart.permissions.prevent'] = function () {
			return new AdminAccessService();
		};

		$container['surecart.permissions.salts'] = function () {
			return new SureCartSaltService();
		};

		$app = $container[ SURECART_APPLICATION_KEY ];
		$app->alias( 'roles', 'surecart.permissions.roles' );
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
		$container['surecart.permissions.prevent']->bootstrap();
	}
}

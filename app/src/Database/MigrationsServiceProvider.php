<?php

namespace SureCart\Database;

use SureCart\Database\Tables\Integrations;
use SureCartCore\ServiceProviders\ServiceProviderInterface;

/**
 * WordPress Users service.
 */
class MigrationsServiceProvider implements ServiceProviderInterface {
	/**
	 * {@inheritDoc}
	 *
	 * @param  \Pimple\Container $container Service Container.
	 */
	public function register( $container ) {
		$container['surecart.tables.integrations'] = function () {
			return new Integrations( new Table() );
		};
	}

	/**
	 * {@inheritDoc}
	 *
	 * @param  \Pimple\Container $container Service Container.
	 */
	public function bootstrap( $container ) {
		$container['surecart.tables.integrations']->install();
	}
}

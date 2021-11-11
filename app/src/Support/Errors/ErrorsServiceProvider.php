<?php

namespace CheckoutEngine\Support\Errors;

use WPEmerge\ServiceProviders\ServiceProviderInterface;

class ErrorsServiceProvider implements ServiceProviderInterface {
	/**
	 * {@inheritDoc}
	 *
	 *  @param  \Pimple\Container $container Service Container.
	 */
	public function register( $container ) {
		$app = $container[ WPEMERGE_APPLICATION_KEY ];

		$container['errors_service'] = function () {
			return new ErrorsService();
		};

		$app->alias( 'errors', 'errors_service' );
	}

	/**
	 * {@inheritDoc}
	 *
	 *  @param  \Pimple\Container $container Service Container.
	 */
	public function bootstrap( $container ) {
		// Nothing to bootstrap.
	}
}

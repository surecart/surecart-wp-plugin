<?php

namespace CheckoutEngine\Request;

use CheckoutEngineCore\ServiceProviders\ServiceProviderInterface;

/**
 * Handles the request service
 */
class RequestServiceProvider implements ServiceProviderInterface {
	/**
	 * {@inheritDoc}
	 *
	 *  @param  \Pimple\Container $container Service Container.
	 */
	public function register( $container ) {
		$app = $container[ CHECKOUT_ENGINE_APPLICATION_KEY ];

		$container['requests'] = function () {
			// TODO: get this from database.
			$token = '3aeru4vdNXQ3akDjFxKPHFME';
			return new RequestService( $token );
		};

		$app->alias( 'requests', 'requests' );

		$app->alias(
			'request',
			function () use ( $app ) {
				return call_user_func_array( [ $app->requests(), 'makeRequest' ], func_get_args() );
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

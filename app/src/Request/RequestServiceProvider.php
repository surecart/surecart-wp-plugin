<?php

namespace CheckoutEngine\Request;

use WPEmerge\ServiceProviders\ServiceProviderInterface;

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
		$app = $container[ WPEMERGE_APPLICATION_KEY ];

		$container['requests'] = function () {
			// TODO: get these from database.
			$mode  = 'staging';
			$token = 's4174p9J3zSBdpMg8p9po3kz';
			return new RequestService( $token, $mode );
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

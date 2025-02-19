<?php

namespace SureCart\Request;

use SureCart\Models\ApiToken;
use SureCart\Support\Errors\ErrorsService;
use SureCartCore\ServiceProviders\ServiceProviderInterface;

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
		$app = $container[ SURECART_APPLICATION_KEY ];

		$container['requests']          = function () use ( $container ) {
			return new RequestService( ApiToken::get(), '/v1', true, $container );
		};
		$container['requests.cache']    = function ( $endpoint, $args, $account_cache_key ) {
			return new RequestCacheService( $endpoint, $args, $account_cache_key );
		};
		$container['requests.errors']   = function () {
			return new ErrorsService();
		};
		$container['requests.unauthed'] = function () {
			return new RequestService( '', '/v1', false );
		};

		$app->alias( 'requests', 'requests' );
		$app->alias( 'unAuthorizedRequests', 'requests.unauthed' );

		$app->alias(
			'request',
			function () use ( $app ) {
				return call_user_func_array( [ $app->requests(), 'makeRequest' ], func_get_args() );
			}
		);

		$app->alias(
			'unAuthorizedRequest',
			function () use ( $app ) {
				return call_user_func_array( [ $app->unAuthorizedRequests(), 'makeRequest' ], func_get_args() );
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

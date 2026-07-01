<?php

namespace SureCart\Tests;

use SureCart\Request\RequestService;

/**
 * Shared helpers for mocking the SureCart request service in unit tests.
 */
trait MocksRequestService {
	/**
	 * Mock the request service and capture the args passed to makeRequest.
	 *
	 * @param mixed $return   Value to return from makeRequest.
	 * @param array $captured Reference filled with the makeRequest args.
	 * @return void
	 */
	protected function mockRequest( $return, &$captured ) {
		$requests = \Mockery::mock( RequestService::class );
		\SureCart::alias(
			'request',
			function () use ( $requests ) {
				return call_user_func_array( [ $requests, 'makeRequest' ], func_get_args() );
			}
		);

		$requests->shouldReceive( 'makeRequest' )
			->once()
			->andReturnUsing(
				function ( ...$args ) use ( $return, &$captured ) {
					$captured = $args;
					return $return;
				}
			);
	}

	/**
	 * Mock the request service so makeRequest is never expected to run.
	 *
	 * @return void
	 */
	protected function mockRequestNeverCalled() {
		$requests = \Mockery::mock( RequestService::class );
		\SureCart::alias(
			'request',
			function () use ( $requests ) {
				return call_user_func_array( [ $requests, 'makeRequest' ], func_get_args() );
			}
		);

		$requests->shouldNotReceive( 'makeRequest' );
	}
}

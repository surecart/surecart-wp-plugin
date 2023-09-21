<?php

namespace SureCart\Tests\Feature\Rest;

use SureCart\Rest\ReturnReasonsRestServiceProvider;
use SureCart\Tests\SureCartUnitTestCase;

class ReturnReasonsRestServiceProviderTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp() {
		parent::setUp();

		// Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap(
			[
				'providers' => [
					\SureCart\WordPress\PluginServiceProvider::class,
					ReturnReasonsRestServiceProvider::class,
					\SureCart\Request\RequestServiceProvider::class,
					\SureCart\Support\Errors\ErrorsServiceProvider::class,
				],
			],
			false
		);
	}

	public function requestProvider() {
		$has_permissions = self::factory()->user->create_and_get();
		$has_permissions->add_cap( 'read_sc_orders' );

		return [
			'List: Unauthenticated'    => [ null, 'GET', '/surecart/v1/return_reasons', 401 ],
			'List: Missing Capability' => [ [], 'GET', '/surecart/v1/return_reasons', 403 ],
			'List: Has Capability'     => [ [ 'read_sc_orders' ], 'GET', '/surecart/v1/return_reasons', 200 ],
		];
	}

	/**
	 * @dataProvider requestProvider
	 */
	public function test_permissions( $caps, $method, $route, $status ) {
		 // mock the requests in the container
		$requests = \Mockery::mock( RequestService::class );
		\SureCart::alias(
			'request',
			function () use ( $requests ) {
				return call_user_func_array( [ $requests, 'makeRequest' ], func_get_args() );
			}
		);

		$requests->shouldReceive( 'makeRequest' )
			->andReturn(
				(object) [
					'id' => 'test',
				]
			);

		if ( is_array( $caps ) ) {
			$user = self::factory()->user->create_and_get();
			foreach ( $caps as $cap ) {
				$user->add_cap( $cap );
			}

			wp_set_current_user( $user->ID ?? null );
		}

		$request  = new \WP_REST_Request( $method, $route );
		$response = rest_do_request( $request );
		$this->assertSame( $status, $response->get_status() );

	}
}

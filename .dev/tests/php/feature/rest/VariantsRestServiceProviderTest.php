<?php

namespace Surecart\Tests\Feature\Rest;

use SureCart\Request\RequestServiceProvider;
use SureCart\Rest\VariantsRestServiceProvider;
use SureCart\Support\Errors\ErrorsServiceProvider;
use SureCart\Tests\SureCartUnitTestCase;
use SureCart\WordPress\PluginServiceProvider;

class VariantsRestServiceProviderTest extends SureCartUnitTestCase{
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp() : void{
		parent::setUp();

		// Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers' => [
				VariantsRestServiceProvider::class,
				RequestServiceProvider::class,
				PluginServiceProvider::class,
				ErrorsServiceProvider::class
			]
		], false);
	}

	public function requestProvider(){
		$has_permissions = self::factory()->user->create_and_get();
		$has_permissions->add_cap('edit_sc_prices');
		$has_permissions->add_cap('publish_sc_prices');
		$has_permissions->add_cap('delete_sc_prices');

		return [
			'List: Unauthenticated' => [null, 'GET','/surecart/v1/variants', 200],
			'List: Missing Capability' => [[], 'GET','/surecart/v1/variants', 200],
			'List: Has Capability' =>  [['edit_sc_prices'], 'GET','/surecart/v1/variants', 200],
			'Find: Unauthenticated' => [null, 'GET','/surecart/v1/variants/test', 200],
			'Find: Without Capability' => [[], 'GET','/surecart/v1/variants/test', 200],
			'Find: Has Capability' => [['edit_sc_prices'], 'GET','/surecart/v1/variants/test', 200],
			'Create: Unauthenticated' => [null, 'POST','/surecart/v1/variants', 401],
			'Create: Without Capability' => [[], 'POST','/surecart/v1/variants', 403],
			'Create: Has Capability' => [['publish_sc_prices'], 'POST','/surecart/v1/variants', 200],
			'Update: Unauthenticated' => [null, 'PUT','/surecart/v1/variants/test', 401],
			'Update: Without Capability' => [[], 'PUT','/surecart/v1/variants/test', 403],
			'Update: Has Capability' => [['edit_sc_prices'], 'PUT','/surecart/v1/variants/test', 200],
			'Delete: Unauthenticated' => [null, 'DELETE','/surecart/v1/variants/test', 401],
			'Delete: Without Capability' => [[], 'DELETE','/surecart/v1/variants/test', 403],
			'Delete: Has Capability' => [['delete_sc_prices'], 'DELETE','/surecart/v1/variants/test', 200],
		];
	}

	/**
	 * @dataProvider requestProvider
	 */
	public function test_permissions( $caps, $method, $route, $status) {
		// mock the requests in the container
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});
		$requests->shouldReceive('makeRequest')->andReturn((object) ['id' => 'test']);

		if (is_array($caps)) {
			$user= self::factory()->user->create_and_get();
			foreach($caps as $cap) {
				$user->add_cap($cap);
			}
			wp_set_current_user($user->ID ?? null);
		}

		// unauthed.
		$request = new \WP_REST_Request($method, $route);
		$response = rest_do_request( $request );
		$this->assertSame($status, $response->get_status());
	}
}

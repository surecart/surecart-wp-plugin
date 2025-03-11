<?php

namespace SureCart\Tests\Feature\Rest;

use SureCart\Request\RequestServiceProvider;
use SureCart\Rest\LineItemsRestServiceProvider;
use SureCart\Support\Errors\ErrorsServiceProvider;
use SureCart\Tests\SureCartUnitTestCase;
use WP_REST_Request;

class LineItemsRestServiceProviderTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp() : void
	{
		parent::setUp();

		// Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers' => [
				\SureCart\WordPress\PluginServiceProvider::class,
				\SureCart\Account\AccountServiceProvider::class,
				\SureCart\Settings\SettingsServiceProvider::class,
				LineItemsRestServiceProvider::class,
				RequestServiceProvider::class,
				ErrorsServiceProvider::class
			]
		], false);
	}

	public function requestProvider() {
		return [
			'List: Unauthenticated' => [null, 'GET', '/surecart/v1/line_items', 401],
			'List: Missing Capability' => [[], 'GET', '/surecart/v1/line_items', 403],
			'List: Has Capability' =>  [['read_sc_prices'], 'GET', '/surecart/v1/line_items', 200],

			// Every other request is 200 because anynonymous users can add/edit/delete/upsell line items.
			'Find: Without Capability' => [null, 'GET', '/surecart/v1/line_items/test', 200],
			'Edit: Without Capability' => [null, 'PATCH', '/surecart/v1/line_items/test', 200],
			'Create: Without Capability' => [null, 'POST', '/surecart/v1/line_items', 200],
			'Delete: Without Capability' => [null, 'DELETE', '/surecart/v1/line_items/test', 200],
			'Upsell: Without Capability' => [null, 'POST', '/surecart/v1/line_items/upsell', 200],
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
		$request = new WP_REST_Request($method, $route);
		$response = rest_do_request( $request );
		$this->assertSame($status, $response->get_status());
	}
}

<?php

namespace SureCart\Tests\Feature\Rest;

use SureCart\Rest\ReturnRequestsRestServiceProvider;
use SureCart\Tests\SureCartUnitTestCase;

class ReturnRequestsRestServiceProviderTest extends SureCartUnitTestCase{
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp(){
		parent::setUp();

		// Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers' => [
				\SureCart\WordPress\PluginServiceProvider::class,
				ReturnRequestsRestServiceProvider::class,
				\SureCart\Request\RequestServiceProvider::class,
				\SureCart\Support\Errors\ErrorsServiceProvider::class,
			],
		], false);
	}

	public function requestProvider(){
		return [
			'List: Unauthenticated' => [null, 'GET', '/surecart/v1/return_requests', 401],
			'List: Missing Capability' => [[], 'GET', '/surecart/v1/return_requests', 403],
			'List: Has Capability' => [['read_sc_orders'],'GET', '/surecart/v1/return_requests', 200],
			'Find: Unauthenticated' => [null, 'GET', '/surecart/v1/return_requests/test', 401],
			'Find: Missing Capability' => [[], 'GET', '/surecart/v1/return_requests/test', 403],
			'Find: Has Capability' => [['read_sc_orders'], 'GET', '/surecart/v1/return_requests/test', 200],
			'Edit: Unauthenticated' => [null, 'PATCH', '/surecart/v1/return_requests/test', 401],
			'Edit: Missing Capability' => [[], 'PATCH', '/surecart/v1/return_requests/test', 403],
			'Edit: Has Capability' => [['edit_sc_orders'], 'PATCH', '/surecart/v1/return_requests/test', 200],
			'Delete: Unauthenticated' => [null, 'DELETE', '/surecart/v1/return_requests/test', 401],
			'Delete: Missing Capability' => [[], 'DELETE', '/surecart/v1/return_requests/test', 403],
			'Delete: Has Capability' => [['delete_sc_orders'], 'DELETE', '/surecart/v1/return_requests/test', 200],
			'Create: Unauthenticated' => [null, 'POST', '/surecart/v1/return_requests', 401],
			'Create: Missing Capability' => [[], 'POST', '/surecart/v1/return_requests', 403],
			'Create: Has Capability' => [['publish_sc_orders'], 'POST', '/surecart/v1/return_requests', 200],
			'Open: Unauthenticated' => [null, 'POST', '/surecart/v1/return_requests/test/open', 401],
			'Open: Missing Capability' => [[], 'POST', '/surecart/v1/return_requests/test/open', 403],
			'Open: Has Capability' => [['edit_sc_orders'], 'POST', '/surecart/v1/return_requests/test/open', 200],
			'Complete: Unauthenticated' => [null, 'POST', '/surecart/v1/return_requests/test/complete', 401],
			'Complete: Missing Capability' => [[], 'POST', '/surecart/v1/return_requests/test/complete', 403],
			'Complete: Has Capability' => [['edit_sc_orders'], 'POST', '/surecart/v1/return_requests/test/complete', 200],
		];
	}

	/**
	 * @dataProvider requestProvider
	 */
	public function test_permissions($caps, $method, $route, $status){
		//mock the requests in the container
        $requests = \Mockery::mock(RequestService::class);
        \SureCart::alias('request', function () use ($requests) {
            return call_user_func_array([$requests, 'makeRequest'], func_get_args());
        });

        $requests->shouldReceive('makeRequest')
            ->andReturn((object) [
                'id' => 'test',
            ]);

        if (is_array($caps)) {
            $user = self::factory()->user->create_and_get();
            foreach ($caps as $cap) {
                $user->add_cap($cap);
            }

            wp_set_current_user($user->ID ?? null);
        }

        $request = new \WP_REST_Request($method, $route);
        $response = rest_do_request($request);
        $this->assertSame($status, $response->get_status());
	}
}

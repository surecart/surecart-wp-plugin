<?php

namespace SureCart\Tests\Feature\Rest;

use SureCart\Request\RequestService;
use SureCart\Request\RequestServiceProvider;
use SureCart\Rest\DisputesRestServiceProvider;
use SureCart\Support\Errors\ErrorsServiceProvider;
use SureCart\Tests\SureCartUnitTestCase;

class DisputeRestServiceProviderTest extends SureCartUnitTestCase {
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
				DisputesRestServiceProvider::class,
				RequestServiceProvider::class,
				ErrorsServiceProvider::class
			]
		], false);
	}

	public function basicRequestProvider(){
		return [
			'List: Unauthenticated' => [null, 'GET','/surecart/v1/disputes', 401],
			'List: Missing Capability' => [[], 'GET','/surecart/v1/disputes', 403],
			'List: Has Capability' =>  [['read_sc_disputes'], 'GET','/surecart/v1/disputes', 200],
			'Find: Unauthenticated' => [null, 'GET','/surecart/v1/disputes/test', 401],
			'Find: Without Capability' => [[], 'GET','/surecart/v1/disputes/test', 403],
			'Find: Has Capability' => [['read_sc_disputes'], 'GET','/surecart/v1/disputes/test', 200],
		];
	}

	/**
	 * @group disputes
	 * @dataProvider basicRequestProvider
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

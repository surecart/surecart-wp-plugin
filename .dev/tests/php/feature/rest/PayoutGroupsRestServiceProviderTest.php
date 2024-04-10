<?php

namespace SureCart\Tests\Feature\Rest;

use SureCart\Account\AccountServiceProvider;
use SureCart\Request\RequestService;
use SureCart\Request\RequestServiceProvider;
use SureCart\Rest\PayoutGroupsRestServiceProvider;
use SureCart\Support\Errors\ErrorsServiceProvider;
use SureCart\Tests\SureCartUnitTestCase;

class PayoutGroupsRestServiceProviderTest extends SureCartUnitTestCase
{
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp() : void
	{
		parent::setUp();

		//Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers' => [
				\SureCart\WordPress\PluginServiceProvider::class,
				AccountServiceProvider::class,
				PayoutGroupsRestServiceProvider::class,
				RequestServiceProvider::class,
				ErrorsServiceProvider::class,
			],
		], false);
	}

	public function requestProvider()
	{
		return [
			'List: Unauthenticated' => [null, 'GET', '/surecart/v1/payout_groups', 401],
			'List: Missing Capability' => [[], 'GET', '/surecart/v1/payout_groups', 403],
			'List: Has Capability' => [['read_sc_affiliates'],'GET', '/surecart/v1/payout_groups', 200],
			'Find: Unauthenticated' => [null, 'GET', '/surecart/v1/payout_groups/test', 401],
			'Find: Missing Capability' => [[], 'GET', '/surecart/v1/payout_groups/test', 403],
			'Find: Has Capability' => [['read_sc_affiliates'], 'GET', '/surecart/v1/payout_groups/test', 200],
			'Create: Unauthenticated' => [null, 'POST', '/surecart/v1/payout_groups', 401],
			'Create: Missing Capability' => [[], 'POST', '/surecart/v1/payout_groups', 403],
			'Create: Has Capability' => [['publish_sc_affiliates'], 'POST', '/surecart/v1/payout_groups', 200],
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

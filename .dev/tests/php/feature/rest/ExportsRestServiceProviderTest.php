<?php

namespace SureCart\Tests\Feature\Rest;

use SureCart\Request\RequestService;
use SureCart\Tests\SureCartUnitTestCase;

class ExportsRestServiceProviderTest extends SureCartUnitTestCase{
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * Set up a new app instance to use for tests.
	 *
	 * @return void
	 */
	public function setUp() : void{
		parent::setUp();

		// Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers' => [
				\SureCart\WordPress\PluginServiceProvider::class,
				\SureCart\Account\AccountServiceProvider::class,
				\SureCart\Rest\ExportsRestServiceProvider::class,
				\SureCart\Request\RequestServiceProvider::class,
				\SureCart\Support\Errors\ErrorsServiceProvider::class,
			],
		], false);
	}

	/**
	 * Data provider for testing permissions
	 *
	 * @return array
	 */
	public function requestProvider(){
		return [
			'List: Unauthenticated' => [null, 'GET', '/surecart/v1/exports', [], 401],
			'List: Missing Capability' => [[], 'GET', '/surecart/v1/exports', [], 403],
			'List: Has Capability' => [['manage_sc_shop_settings'],'GET', '/surecart/v1/exports', [], 200],
			'Find: Unauthenticated' => [null, 'GET', '/surecart/v1/exports/test', [], 401],
			'Find: Missing Capability' => [[], 'GET', '/surecart/v1/exports/test', [], 403],
			'Find: Has Capability' => [['manage_sc_shop_settings'], 'GET', '/surecart/v1/exports/test', [], 200],
			'Create: Unauthenticated' => [null, 'POST', '/surecart/v1/exports', ['type'=> 'payouts'], 401],
			'Create: Missing Capability' => [[], 'POST', '/surecart/v1/exports', ['type'=> 'payouts'], 403],
			'Create: Wrong Capability' => [['publish_sc_affiliates'], 'POST', '/surecart/v1/exports', ['type'=> 'subscriptions'], 403],
			'Create: Has Capability' => [['publish_sc_affiliates'], 'POST', '/surecart/v1/exports', ['type'=> 'payouts'], 200],
		];
	}

	/**
	 * Test permissions for the ExportsRestServiceProvider
	 *
	 * @dataProvider requestProvider
	 * @param array|null $caps
	 * @param string $method
	 * @param string $route
	 * @param int $status
	 * @return void
	 */
	public function test_permissions($caps, $method, $route,$args = [], $status){
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

        $request = new \WP_REST_Request($method, $route, $args);
		foreach($args as $key => $arg) {
			$request->set_param($key, $arg);
		}
        $response = rest_do_request($request);
        $this->assertSame($status, $response->get_status());
	}
}

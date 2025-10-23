<?php

namespace SureCart\Tests\Feature\Rest;

use SureCart\Account\AccountServiceProvider;
use SureCart\Request\RequestService;
use SureCart\Request\RequestServiceProvider;
use SureCart\Rest\DownloadRestServiceProvider;
use SureCart\Settings\SettingsServiceProvider;
use SureCart\Support\Errors\ErrorsServiceProvider;
use SureCart\Tests\SureCartUnitTestCase;

class DownloadRestServiceProviderTest extends SureCartUnitTestCase
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
				DownloadRestServiceProvider::class,
				SettingsServiceProvider::class,
				RequestServiceProvider::class,
				ErrorsServiceProvider::class,
			],
			'permission_controllers' => [
				\SureCart\Permissions\Models\DownloadPermissionsController::class,
			],
		], false);
	}

	public function requestProvider()
	{
		return [
			'List: Unauthenticated' => [null, 'GET', '/surecart/v1/downloads', 401],
			'List: Missing Capability' => [[], 'GET', '/surecart/v1/downloads', 403],
			'List: Has Capability' => [['read_sc_downloads'],'GET', '/surecart/v1/downloads', 200],
			'Find: Unauthenticated' => [null, 'GET', '/surecart/v1/downloads/test', 401],
			'Find: Missing Capability' => [[], 'GET', '/surecart/v1/downloads/test', 403],
			'Find: Has Capability' => [['read_sc_medias'], 'GET', '/surecart/v1/downloads/test', 200],
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

	public function customerRequestProvider()
	{

		$user = self::factory()->user->create_and_get();
		$user = \SureCart\Models\User::find($user->ID);
		$user->setCustomerId('correct_customer_id');

		return [
			'List: All' => [$user, 'GET', '/surecart/v1/downloads', 403],
			'List: Own' => [$user, 'GET', '/surecart/v1/downloads', 200, ['query' => ['customer_ids' => ['correct_customer_id']]]],
			'List: Others' => [$user, 'GET', '/surecart/v1/downloads', 403, ['query' => ['customer_ids' => ['wrong_customer_id']]]],
		];
	}

	/**
	 * @dataProvider customerRequestProvider
	 */
	public function test_customer_permissions($user, $method, $route, $status, $params = []){
		//mock the requests in the container
        $requests = \Mockery::mock(RequestService::class);
        \SureCart::alias('request', function () use ($requests) {
            return call_user_func_array([$requests, 'makeRequest'], func_get_args());
        });

        $requests->shouldReceive('makeRequest')
            ->andReturn((object) [
                'id' => 'test',
            ]);

        wp_set_current_user($user->ID);

        $request = new \WP_REST_Request($method, $route);
		if (is_array($params) && isset($params['query'])) {
            $request->set_query_params($params['query']);
        }

        $response = rest_do_request($request);
        $this->assertSame($status, $response->get_status());
	}
}

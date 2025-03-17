<?php

namespace SureCart\Tests\Feature\Rest;

use SureCart\Account\AccountServiceProvider;
use SureCart\Request\RequestService;
use SureCart\Request\RequestServiceProvider;
use SureCart\Rest\AffiliationsRestServiceProvider;
use SureCart\Settings\SettingsServiceProvider;
use SureCart\Support\Errors\ErrorsServiceProvider;
use SureCart\Tests\SureCartUnitTestCase;

class AffiliationsRestServiceProviderTest extends SureCartUnitTestCase
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
				AffiliationsRestServiceProvider::class,
				RequestServiceProvider::class,
				SettingsServiceProvider::class,
				ErrorsServiceProvider::class,
			],
		], false);
	}

	public function requestProvider()
	{
		return [
			'List: Unauthenticated' => [null, 'GET', '/surecart/v1/affiliations', 401],
			'List: Missing Capability' => [[], 'GET', '/surecart/v1/affiliations', 403],
			'List: Has Capability' => [['read_sc_affiliates'],'GET', '/surecart/v1/affiliations', 200],
			'Find: Unauthenticated' => [null, 'GET', '/surecart/v1/affiliations/test', 401],
			'Find: Missing Capability' => [[], 'GET', '/surecart/v1/affiliations/test', 403],
			'Find: Has Capability' => [['read_sc_affiliates'], 'GET', '/surecart/v1/affiliations/test', 200],
			'Edit: Unauthenticated' => [null, 'PATCH', '/surecart/v1/affiliations/test', 401],
			'Edit: Missing Capability' => [[], 'PATCH', '/surecart/v1/affiliations/test', 403],
			'Edit: Has Capability' => [['edit_sc_affiliates'], 'PATCH', '/surecart/v1/affiliations/test', 200],
			'Activate: Unauthenticated' => [null, 'PATCH', '/surecart/v1/affiliations/test/activate', 401],
			'Activate: Missing Capability' => [[], 'PATCH', '/surecart/v1/affiliations/test/activate', 403],
			'Activate: Has Capability' => [['edit_sc_affiliates'], 'PATCH', '/surecart/v1/affiliations/test/activate', 200],
			'Deactivate: Unauthenticated' => [null, 'PATCH', '/surecart/v1/affiliations/test/deactivate', 401],
			'Deactivate: Missing Capability' => [[], 'PATCH', '/surecart/v1/affiliations/test/deactivate', 403],
			'Deactivate: Has Capability' => [['edit_sc_affiliates'], 'PATCH', '/surecart/v1/affiliations/test/deactivate', 200],
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

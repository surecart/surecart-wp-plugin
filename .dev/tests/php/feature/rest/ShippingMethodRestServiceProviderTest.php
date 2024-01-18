<?php

namespace SureCart\Tests\Feature\Rest;

use SureCart\Request\RequestService;
use SureCart\Request\RequestServiceProvider;
use SureCart\Rest\ShippingMethodRestServiceProvider;
use SureCart\Support\Errors\ErrorsServiceProvider;
use SureCart\Tests\SureCartUnitTestCase;

class ShippingMethodRestServiceProviderTest extends SureCartUnitTestCase
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
                ShippingMethodRestServiceProvider::class,
                RequestServiceProvider::class,
                ErrorsServiceProvider::class,
            ],
        ], false);
    }

    public function requestProvider()
    {
        $has_permissions = self::factory()->user->create_and_get();
        $has_permissions->add_cap('manage_sc_shop_settings');

        return [
            'List: Unauthenticated' => [null, 'GET', '/surecart/v1/shipping_methods', 401],
            'List: Missing Capability' => [[], 'GET', '/surecart/v1/shipping_methods', 403],
            'List: Has Capability' => [['manage_sc_shop_settings'],'GET', '/surecart/v1/shipping_methods', 200],
            'Find: Unauthenticated' => [null, 'GET', '/surecart/v1/shipping_methods/test', 401],
            'Find: Missing Capability' => [[], 'GET', '/surecart/v1/shipping_methods/test', 403],
            'Find: Has Capability' => [['manage_sc_shop_settings'], 'GET', '/surecart/v1/shipping_methods/test', 200],
			'Edit: Unauthenticated' => [null, 'PATCH', '/surecart/v1/shipping_methods/test', 401],
            'Edit: Missing Capability' => [[], 'PATCH', '/surecart/v1/shipping_methods/test', 403],
            'Edit: Has Capability' => [['manage_sc_shop_settings'], 'PATCH', '/surecart/v1/shipping_methods/test', 200],
			'Delete: Unauthenticated' => [null, 'DELETE', '/surecart/v1/shipping_methods/test', 401],
            'Delete: Missing Capability' => [[], 'DELETE', '/surecart/v1/shipping_methods/test', 403],
            'Delete: Has Capability' => [['manage_sc_shop_settings'], 'DELETE', '/surecart/v1/shipping_methods/test', 200],
			'Create: Unauthenticated' => [null, 'POST', '/surecart/v1/shipping_methods', 401],
            'Create: Missing Capability' => [[], 'POST', '/surecart/v1/shipping_methods', 403],
            'Create: Has Capability' => [['manage_sc_shop_settings'], 'POST', '/surecart/v1/shipping_methods', 200],
        ];
    }

    /**
	 * @dataProvider requestProvider
     */
    public function test_permissions($caps, $method, $route, $status)
    {
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

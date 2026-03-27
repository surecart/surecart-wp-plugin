<?php

namespace SureCart\Tests\Feature\Rest;

use SureCart\Account\AccountServiceProvider;
use SureCart\Request\RequestService;
use SureCart\Request\RequestServiceProvider;
use SureCart\Rest\InvoicesRestServiceProvider;
use SureCart\Support\Errors\ErrorsServiceProvider;
use SureCart\Tests\SureCartUnitTestCase;

class InvoiceRestServiceProviderTest extends SureCartUnitTestCase
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
				InvoicesRestServiceProvider::class,
				\SureCart\WordPress\Pages\PageServiceProvider::class,
				RequestServiceProvider::class,
				ErrorsServiceProvider::class,
			],
		], false);
	}

	public function requestProvider()
	{
		return [
			'List: Unauthenticated' => [null, 'GET', '/surecart/v1/invoices', 401],
			'List: Missing Capability' => [[], 'GET', '/surecart/v1/invoices', 403],
			'List: Has Capability' => [['read_sc_invoices'],'GET', '/surecart/v1/invoices', 200],

			// TODO: Test the invoice details.
			// 'Find: Unauthenticated' => [null, 'GET', '/surecart/v1/invoices/test', 401],
			// 'Find: Missing Capability' => [[], 'GET', '/surecart/v1/invoices/test', 403],
			// 'Find: Has Capability' => [['read_sc_invoice'], 'GET', '/surecart/v1/invoices/test', 200],

			'Create: Unauthenticated' => [null, 'POST', '/surecart/v1/invoices', 401],
			'Create: Missing Capability' => [[], 'POST', '/surecart/v1/invoices', 403],
			'Create: Has Capability' => [['publish_sc_invoices'], 'POST', '/surecart/v1/invoices', 200],

			'Edit: Unauthenticated' => [null, 'PATCH', '/surecart/v1/invoices/test', 401],
			'Edit: Missing Capability' => [[], 'PATCH', '/surecart/v1/invoices/test', 403],
			'Edit: Has Capability' => [['edit_sc_invoices'], 'PATCH', '/surecart/v1/invoices/test', 200],

			'Delete: Unauthenticated' => [null, 'DELETE', '/surecart/v1/invoices/test', 401],
			'Delete: Missing Capability' => [[], 'DELETE', '/surecart/v1/invoices/test', 403],
			'Delete: Has Capability' => [['delete_sc_invoices'], 'DELETE', '/surecart/v1/invoices/test', 200],

			'Make Draft: Unauthenticated' => [null, 'PATCH', '/surecart/v1/invoices/test/make_draft', 401],
			'Make Draft: Missing Capability' => [[], 'PATCH', '/surecart/v1/invoices/test/make_draft', 403],
			'Make Draft: Has Capability' => [['edit_sc_invoices'], 'PATCH', '/surecart/v1/invoices/test/make_draft', 200],

			'Open: Unauthenticated' => [null, 'PATCH', '/surecart/v1/invoices/test/open', 401],
			'Open: Missing Capability' => [[], 'PATCH', '/surecart/v1/invoices/test/open', 403],
			'Open: Has Capability' => [['edit_sc_invoices'], 'PATCH', '/surecart/v1/invoices/test/open', 200],
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

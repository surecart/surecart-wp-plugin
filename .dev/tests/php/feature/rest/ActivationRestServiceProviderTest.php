<?php

namespace SureCart\Tests\Feature\Rest;

use SureCart\Models\License;
use SureCart\Request\RequestService;
use SureCart\Rest\ActivationRestServiceProvider;
use SureCart\Tests\SureCartUnitTestCase;

class ActivationRestServiceProviderTest extends SureCartUnitTestCase{
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp() : void {
		parent::setUp();

		// Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers' => [
				\SureCart\WordPress\PluginServiceProvider::class,
				ActivationRestServiceProvider::class,
				\SureCart\Request\RequestServiceProvider::class,
				\SureCart\Support\Errors\ErrorsServiceProvider::class,
			],
		], false);
	}

	public function requestProvider(){
		return [
			'List: Unauthenticated' => [null, 'GET', '/surecart/v1/activations', 401],
            'List: Missing Capability' => [[], 'GET', '/surecart/v1/activations', 403],
			'List: Has capability to view license activations' => [['read'], 'GET', '/surecart/v1/activations', 200, ['license_ids' => ['test_license']]],
			'List: Unauthenticated to view license activations' => [['read'], 'GET', '/surecart/v1/activations', 403, ['license_ids' => ['invalid_license']]],
            'List: Has Capability' => [['read_sc_products'],'GET', '/surecart/v1/activations', 200],
            'Find: Unauthenticated' => [null, 'GET', '/surecart/v1/activations/test', 401],
            'Find: Missing Capability' => [[], 'GET', '/surecart/v1/activations/test', 403],
            'Find: Has Capability' => [['read_sc_products'], 'GET', '/surecart/v1/activations/test', 200],
			'Edit: Unauthenticated' => [null, 'PATCH', '/surecart/v1/activations/test', 401],
            'Edit: Missing Capability' => [[], 'PATCH', '/surecart/v1/activations/test', 403],
            'Edit: Has Capability' => [['edit_sc_products'], 'PATCH', '/surecart/v1/activations/test', 200],
			'Delete: Unauthenticated' => [null, 'DELETE', '/surecart/v1/activations/test', 401],
            'Delete: Missing Capability' => [[], 'DELETE', '/surecart/v1/activations/test', 403],
            'Delete: Has Capability' => [['edit_sc_products'], 'DELETE', '/surecart/v1/activations/test', 200],
			'Create: Unauthenticated' => [null, 'POST', '/surecart/v1/activations', 401],
            'Create: Missing Capability' => [[], 'POST', '/surecart/v1/activations', 403],
            'Create: Has Capability' => [['publish_sc_products'], 'POST', '/surecart/v1/activations', 200],
		];
	}

	/**
	 * @dataProvider requestProvider
	 */
	public function test_permissions($caps, $method, $route, $status, $attributes = []) {
		// mock the requests in the container
        $requests = \Mockery::mock(RequestService::class);
        \SureCart::alias('request', function () use ($requests) {
            return call_user_func_array([$requests, 'makeRequest'], func_get_args());
        });

		// mock For customer read api request
		$this->maybeMockCustomerApiRequest($caps, $attributes);

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
		$request->set_query_params($attributes);
        $response = rest_do_request($request);
        $this->assertSame($status, $response->get_status());
	}

	public function maybeMockCustomerApiRequest($caps, $attributes) {
		// Mock the License model.
		$licenseId = $attributes['license_ids'][0] ?? null;
		$mockLicenses = \Mockery::mock('alias:' . License::class);
		$mockLicenses->shouldReceive('where')
			->with(['ids' => [$licenseId]])
			->andReturnSelf()
			->shouldReceive('get')
			->andReturnUsing(function () use ($licenseId) {
				$mockLicense = \Mockery::mock([
					'id' => $licenseId,
				]);

				$mockLicense->shouldReceive('belongsToUser')
					->andReturnUsing(function ($user) use ($licenseId) {
						return $licenseId === 'test_license';
					});

				return [$mockLicense];
			});
	}
}

<?php
namespace SureCart\Tests\Feature\Rest;

use SureCart\Request\RequestServiceProvider;
use SureCart\Rest\AbandonedCheckoutRestServiceProvider;
use SureCart\Support\Errors\ErrorsServiceProvider;
use SureCart\Tests\SureCartUnitTestCase;
use WP_REST_Request;

class AbandonedCheckoutRestServiceProviderTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp()
	{
		parent::setUp();

		// Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers' => [
				AbandonedCheckoutRestServiceProvider::class,
				RequestServiceProvider::class,
				ErrorsServiceProvider::class
			]
		], false);
	}

	public function requestProvider() {
		$has_permissions = self::factory()->user->create_and_get();
		$has_permissions->add_cap('read_sc_checkouts');

		return [
			'List: Unauthenticated' => [null, 'GET', '/surecart/v1/abandoned_checkouts', 401],
			'List: Missing Capability' => [[], 'GET', '/surecart/v1/abandoned_checkouts', 403],
			'List: Has Capability' =>  [['read_sc_checkouts'], 'GET', '/surecart/v1/abandoned_checkouts', 200],
			'Find: Unauthenticated' => [null, 'GET', '/surecart/v1/abandoned_checkouts/test', 401],
			'Find: Without Capability' => [[], 'GET', '/surecart/v1/abandoned_checkouts/test', 403],
			'Find: Has Capability' => [['read_sc_checkouts'], 'GET', '/surecart/v1/abandoned_checkouts/test', 200]
		];
	}


	/**
	 * @group failing
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
		$request = new \WP_REST_Request($method, $route);
		$response = rest_do_request( $request );
		$this->assertSame($status, $response->get_status());
	}

}

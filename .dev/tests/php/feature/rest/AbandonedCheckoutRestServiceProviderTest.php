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
			[null, 'GET', '/surecart/v1/abandoned_checkouts', 401],
			[self::factory()->user->create_and_get(), 'GET', '/surecart/v1/abandoned_checkouts', 403],
			[$has_permissions, 'GET', '/surecart/v1/abandoned_checkouts', 200],
			[null, 'GET', '/surecart/v1/abandoned_checkouts/test', 401],
			[self::factory()->user->create_and_get(), 'GET', '/surecart/v1/abandoned_checkouts/test', 403],
			[$has_permissions, 'GET', '/surecart/v1/abandoned_checkouts/test', 200]
		];
	}


	/**
	 * @group failing
	 * @dataProvider requestProvider
	 */
	public function test_permissions( $user, $method, $route, $status) {
		// mock the requests in the container
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});
		$requests->shouldReceive('makeRequest')->andReturn((object) ['id' => 'test']);

		wp_set_current_user($user->ID ?? null);

		// unauthed.
		$request = new \WP_REST_Request($method, $route);
		$response = rest_do_request( $request );
		$this->assertSame($status, $response->get_status());

		// // no permission.
		// $user = self::factory()->user->create_and_get();
		// wp_set_current_user($user->ID);
		// $request = new \WP_REST_Request('GET', '/surecart/v1/abandoned_checkouts');
		// $response = rest_do_request( $request );
		// $this->assertSame(403, $response->get_status());

		// // has cap.
		// $user = self::factory()->user->create_and_get();
		// $user->add_cap('read_sc_checkouts');
		// wp_set_current_user($user->ID);
		// $request = new \WP_REST_Request('GET', '/surecart/v1/abandoned_checkouts');
		// $response = rest_do_request( $request );
		// $this->assertSame(200, $response->get_status());
		// $data = $response->get_data();
		// $this->assertSame($data['email_exists'], true);
	}

}

<?php
namespace SureCart\Tests\Feature\Rest;

use SureCart\Models\User;
use SureCart\Request\RequestServiceProvider;
use SureCart\Rest\SubscriptionRestServiceProvider;
use SureCart\Support\Errors\ErrorsServiceProvider;
use SureCart\Tests\SureCartUnitTestCase;

class SubscriptionRestServiceProviderTest extends SureCartUnitTestCase {
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
				SubscriptionRestServiceProvider::class,
				RequestServiceProvider::class,
				ErrorsServiceProvider::class
			]
		], false);
	}

	/**
	 * @group api
	 * @group permissions
	 */
	public function test_can_preserve_permissions() {
		// mock the requests in the container
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});
		$requests->shouldReceive('makeRequest')->withSomeOfArgs('subscriptions/test_id')->once()->andReturn((object) ['customer' => 'testcustomerid']);
		$requests->shouldReceive('makeRequest')->withSomeOfArgs('subscriptions/test_id/preserve/')->once()->andReturn((object) ['customer' => 'testcustomerid']);

		// security
		$request = new \WP_REST_Request('PATCH', '/surecart/v1/subscriptions/test_id/preserve');
		$response = rest_do_request( $request );
		$this->assertTrue($response->is_error());
		$this->assertSame(401, $response->get_status(), 'Danger: Anyone can preserve.');

		$user = self::factory()->user->create_and_get();
		wp_set_current_user($user->ID);
		$request = new \WP_REST_Request('PATCH', '/surecart/v1/subscriptions/test_id/preserve');
		$response = rest_do_request( $request );
		$this->assertTrue($response->is_error());
		$this->assertSame(403, $response->get_status(), 'Danger: Anyone can preserve.');

		// missing permission
		$user = User::find(self::factory()->user->create());
		$user->setCustomerId('testcustomerid');
		wp_set_current_user($user->ID);
		$request = new \WP_REST_Request('PATCH', '/surecart/v1/subscriptions/test_id/preserve');
		$response = rest_do_request( $request );
		$this->assertSame(200, $response->get_status());
	}
}

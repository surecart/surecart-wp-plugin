<?php

namespace SureCart\Tests\Feature\Rest;

use SureCart\Account\AccountService;
use SureCart\Account\AccountServiceProvider;
use SureCart\Models\User;
use SureCart\Request\RequestService;
use SureCart\Request\RequestServiceProvider;
use SureCart\Rest\CheckoutRestServiceProvider;
use SureCart\Settings\SettingsServiceProvider;
use SureCart\Support\Errors\ErrorsServiceProvider;
use SureCart\Sync\SyncServiceProvider;
use SureCart\Tests\SureCartUnitTestCase;
use SureCart\WordPress\PluginServiceProvider;
use SureCartAppCore\AppCore\AppCoreServiceProvider;
use SureCartAppCore\Assets\AssetsServiceProvider;
use SureCartAppCore\Config\ConfigServiceProvider;
use WP_REST_Request;

class CheckoutRestServiceProviderTest extends SureCartUnitTestCase
{
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp() : void
	{
		parent::setUp();

		// Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers' => [
				PluginServiceProvider::class,
				SettingsServiceProvider::class,
				AccountServiceProvider::class,
				CheckoutRestServiceProvider::class,
				RequestServiceProvider::class,
				ErrorsServiceProvider::class,
				SyncServiceProvider::class,
				ConfigServiceProvider::class,
				AppCoreServiceProvider::class,
				AssetsServiceProvider::class,
			]
		], false);

		// Test data
		$this->display_currencies = [
			(object)[
				'id' => 'test_id_1',
				'object' => 'display_currency',
				'currency' => 'usd',
				'current_exchange_rate' => 1.0,
				'created_at' => time(),
				'updated_at' => time(),
			]
		];

		// Mock the request service
		$requests = \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function() use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		// Mock display currencies request
		$requests->shouldReceive('makeRequest')
		->withSomeOfArgs('display_currencies')
		->andReturn((object)[
			'data' => $this->display_currencies,
		]);
	}

	/**
	 * @group checkout
	 */
	public function test_can_finalize()
	{
		$this->markTestIncomplete('This test has not been implemented yet.');
		$test_form = self::factory()->post->create_and_get(array(
			'post_type' => 'sc_form',
			'post_content' => '<!-- wp:surecart/form {"mode":"test"} --><!-- /wp:surecart/form -->'
		));

		// mock the requests in the container
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		$account = \Mockery::mock(AccountService::class)->shouldAllowMockingProtectedMethods();
		\SureCart::alias('account', function () use ($account) {
			return $account;
		});
		$account->shouldReceive('fetchCachedAccount')->andReturn((object) ['claimed' => true]);


		$requests->shouldReceive('makeRequest')
			->once()
			->withSomeOfArgs('checkouts/testid/finalize/')
			->andReturn([
				'email' => 'test@test.com'
			]);

		$request = new WP_REST_Request('PATCH', '/surecart/v1/checkouts/testid/finalize');
		$request->set_query_params(['form_id' => $test_form->ID]);
		$request->set_param('processor_type', 'stripe');
		$response = rest_do_request($request);
		$this->assertSame($response->get_status(), 200);
	}

	/**
	 * @group checkout
	 */
	public function test_product_id_without_form_id_must_have_buy_metadata()
	{
		$this->markTestIncomplete('This test has not been implemented yet.');
		// mock the requests in the container
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		$requests->shouldReceive('makeRequest')->once()->withSomeOfArgs('products/testid')->andReturn((object) ['id' =>'testid']);
		$requests->shouldReceive('makeRequest')->withSomeOfArgs('checkouts/testid/finalize/')->andReturn((object) ['live_mode' => false]);

		$request = new WP_REST_Request('POST', '/surecart/v1/checkouts/testid/finalize');
		$request->set_param('live_mode', false);
		$request->set_param('product_id', 'testid');
		$response = rest_do_request($request);
		$this->assertSame($response->get_status(), 400);
	}

	/**
	 * @group checkout
	 */
	public function test_product_id_must_be_in_checkout_line_items()
	{
		$this->markTestIncomplete('This test has not been implemented yet.');
		// mock the requests in the container
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		$requests->shouldReceive('makeRequest')->withSomeOfArgs('checkouts/testid/finalize/')->andReturn((object) ['live_mode' => false, 'line_items' => (object) ['data' => [(object) ['price' => (object) ['product' => (object) ['id' => 'notit']]]]]]);
		$requests->shouldReceive('makeRequest')->once()->withSomeOfArgs('products/testid')->andReturn((object) ['id' =>'testid', 'metadata' => (object) ['wp_buy_link_enabled' => 'true']]);
		$request = new WP_REST_Request('POST', '/surecart/v1/checkouts/testid/finalize');
		$request->set_param('live_mode', false);
		$request->set_param('product_id', 'testid');
		$response = rest_do_request($request);
		$this->assertSame($response->get_status(), 403);
	}

	/**
	 * @group checkout
	 */
	public function test_live_payments_are_always_allowed()
	{
		// mock the requests in the container
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		$form = self::factory()->post->create_and_get(array(
			'post_type' => 'sc_form',
			'post_content' => '<!-- wp:surecart/form {"mode":"test"} --><!-- /wp:surecart/form -->'
		));

		$requests->shouldReceive('makeRequest')->andReturn([]);

		// always allow forced live payments, even on a test form.
		$request = new WP_REST_Request('POST', '/surecart/v1/checkouts');
		$request->set_param('live_mode', true);
		$request->set_query_params(['form_id' => $form->ID]);
		$response = rest_do_request($request);
		$this->assertSame($response->get_status(), 200);

		// default to live if no mode is sent with the request, even if the form is in test mode.
		$request = new WP_REST_Request('POST', '/surecart/v1/checkouts');
		$request->set_query_params(['form_id' => $form->ID]);
		$response = rest_do_request($request);
		$this->assertSame($response->get_status(), 200);
	}

	/**
	 * @group checkout
	 */
	public function test_has_user_in_response()
	{
		// mock the requests in the container
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});
		$requests->shouldReceive('makeRequest')->andReturn(['email' => 'test@test.com']);

		$request = new WP_REST_Request('PATCH', '/surecart/v1/checkouts/test');
		$response = rest_do_request($request);
		$data = $response->get_data();
		$this->assertSame($data['email_exists'], false);

		self::factory()->user->create([
			'user_email' => 'test@test.com'
		]);
		$response = rest_do_request($request);
		$data = $response->get_data();
		$this->assertSame($data['email_exists'], true);
	}

	/**
	 * @group checkout
	 */
	public function test_must_have_edit_permissions_to_manually_pay()
	{
		// mock the requests in the container
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});
		$requests->shouldReceive('makeRequest')->andReturn(['email' => 'test@test.com']);

		// not authenticated.
		$request = new WP_REST_Request('PATCH', '/surecart/v1/checkouts/test/manually_pay');
		$response = rest_do_request($request);
		$this->assertSame(401, $response->get_status());

		// missing permission
		$user = self::factory()->user->create_and_get();
		wp_set_current_user($user->ID);
		$request = new WP_REST_Request('PATCH', '/surecart/v1/checkouts/test/manually_pay');
		$response = rest_do_request($request);
		$this->assertSame(403, $response->get_status());

		// should succeed with the cap.
		$user = self::factory()->user->create_and_get();
		$user->add_cap('edit_sc_checkouts');
		wp_set_current_user($user->ID);
		$request = new WP_REST_Request('PATCH', '/surecart/v1/checkouts/test/manually_pay');
		$response = rest_do_request($request);
		$this->assertSame(200, $response->get_status());
	}

	/**
	 * @group checkout
	 */
	public function test_confirm_creates_live_user()
	{
		// mock the requests in the container
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		$requests->shouldReceive('makeRequest')->andReturn(
			json_decode(
				json_encode(
					[
						'live_mode' => true,
						'customer' =>
							[
								'id' => 'live_id',
								'email' => 'new@test.com',
								'first_name' => 'New First',
								'last_name' => 'New Last',
							]
					]
				)
			)
		);

		// guest user.
		$request = new WP_REST_Request('PATCH', '/surecart/v1/checkouts/test/confirm');
		$response = rest_do_request($request);
		$this->assertSame(200, $response->get_status());

		$user = User::getUserBy('email', 'new@test.com');
		$this->assertNotFalse($user);
		$this->assertSame($user->customerId('live'), 'live_id');
	}

	/**
	 * @group checkout
	 * @group customer
	 * @group user
	 */
	public function test_confirm_creates_test_user()
	{
		// mock the requests in the container
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		$requests->shouldReceive('makeRequest')->andReturn(
			json_decode(
				json_encode(
					[
						'live_mode' => false,
						'customer' =>
							[
								'id' => 'test_id',
								'email' => 'new@test.com',
								'first_name' => 'New First',
								'last_name' => 'New Last',
							]
					]
				)
			)
		);

		// guest user.
		$request = new WP_REST_Request('PATCH', '/surecart/v1/checkouts/test/confirm');
		$response = rest_do_request($request);
		$this->assertSame(200, $response->get_status());

		$user = User::getUserBy('email', 'new@test.com');
		$this->assertNotFalse($user);
		$this->assertSame($user->customerId('test'), 'test_id');
	}

	/**
	 * @group checkout
	 */
	public function test_can_cancel()
	{
		// mock the requests in the container
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		$requests->shouldReceive('makeRequest')
		->once()
		->withSomeOfArgs('checkouts/testid/cancel/')
		->andReturn([]);


		// Mock display currencies request
		$requests->shouldReceive('makeRequest')
		->withSomeOfArgs('display_currencies')
		->andReturn((object)[
			'data' => $this->display_currencies,
		]);

		// unauthed.
		$request = new WP_REST_Request('PATCH', '/surecart/v1/checkouts/testid/cancel');
		$response = rest_do_request($request);
		$this->assertSame($response->get_status(), 401);

		// without cap
		$user = self::factory()->user->create_and_get();
		wp_set_current_user($user->ID);
		$request = new WP_REST_Request('PATCH', '/surecart/v1/checkouts/testid/cancel');
		$response = rest_do_request($request);
		$this->assertSame($response->get_status(), 403);

		// has cap.
		$user = self::factory()->user->create_and_get();
		$user->add_cap('edit_sc_orders');
		wp_set_current_user($user->ID);

		$request = new WP_REST_Request('PATCH', '/surecart/v1/checkouts/testid/cancel');
		$response = rest_do_request($request);
		$this->assertSame($response->get_status(), 200);
	}

	public function test_must_have_edit_permissions_to_change_tax_behavior()
	{
		// mock the requests in the container
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});
		$requests->shouldReceive('makeRequest')->andReturn(['email' => 'test@test.com']);

		// missing permission
		$user = self::factory()->user->create_and_get();
		wp_set_current_user($user->ID);

		// not authenticated.
		$request = new WP_REST_Request('PATCH', '/surecart/v1/checkouts/test');
		$request->set_body_params(['tax_behavior' => 'taxable']);
		$response = rest_do_request($request);
		$this->assertSame(403, $response->get_status());

		// should succeed with the cap.
		$user = self::factory()->user->create_and_get();
		$user->add_cap('edit_sc_checkouts');
		wp_set_current_user($user->ID);
		$request = new WP_REST_Request('PATCH', '/surecart/v1/checkouts/test');
		$request->set_body_params(['tax_behavior' => 'taxable']);
		$response = rest_do_request($request);
		$this->assertSame(200, $response->get_status());
	}
}

<?php

namespace SureCart\Tests\Controllers\Rest;

use SureCart\Middleware\CustomerDashboardMiddleware;
use SureCart\Models\User;
use SureCart\Tests\SureCartUnitTestCase;
use SureCartCore\Responses\ResponseService;
use SureCartVendors\Psr\Http\Message\ResponseInterface;
use SureCartCore\Requests\RequestInterface;

/**
 * @group middleware
 */
class CustomerDashboardMiddlewareTest extends SureCartUnitTestCase
{
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	public function setUp()
	{
		parent::setUp();

		// Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers' => [
				\SureCart\Request\RequestServiceProvider::class,
				\SureCart\WordPress\Pages\PageServiceProvider::class,
			]
		], false);

		$this->response_service = \Mockery::mock(ResponseService::class);
		$this->response = \Mockery::mock(ResponseInterface::class);
		$this->subject = \Mockery::mock(CustomerDashboardMiddleware::class)->makePartial();
		$this->api_request = \Mockery::mock(RequestService::class);
		$self = $this;
		\SureCart::alias('request', function () use ($self) {
			return call_user_func_array([$self->api_request, 'makeRequest'], func_get_args());
		});
	}

	public function tearDown()
	{
		parent::tearDown();
		\Mockery::close();
		remove_filter('wp_die_handler', 'wp_die_handler_filter');
		wp_set_current_user(0);

		unset($this->response_service);
		unset($this->response);
		unset($this->subject);
	}

	/**
	 * Should fail if expired.
	 */
	public function test_should_fail_if_expired()
	{
		// mock the requests in the container
		$this->api_request->shouldReceive('makeRequest')
			->once()
			->withSomeOfArgs('customer_links/expiredid')
			->andReturn((object) [
				"id" => "10271106-8d03-4b3e-96a9-b52c1c6336da",
				"object" => "customer_link",
				"expired" => true,
			]);
		$request = \Mockery::mock(RequestInterface::class);
		$request->shouldReceive('query')->with('customer_link_id')->andReturn('expiredid');

		$this->subject->shouldReceive('error')->once()->with(\Mockery::on(function ($error) {
			return $error->get_error_code() === 'link_expired';
		}));
		$this->subject->handle($request, function () {});
	}

	/**
	 * Should fail if the link is not valid.
	 */
	public function test_should_fail_if_not_found()
	{
		// mock the requests in the container
		$this->api_request->shouldReceive('makeRequest')
			->once()
			->withSomeOfArgs('customer_links/notfoundid')
			->andReturn(new \WP_Error('not_found', 'Not found'));

		$request = \Mockery::mock(RequestInterface::class);
		$request->shouldReceive('query')->with('customer_link_id')->andReturn('notfoundid');

		$this->subject->shouldReceive('error')->once()->with(\Mockery::on(function ($error) {
			return $error->get_error_code() === 'not_found';
		}));

		$this->subject->handle($request, function () {});
	}

	/**
	 * Should fail if neither the email or a user with a customer id is found.
	 */
	public function test_should_create_user_if_email_or_customer_id_not_found()
	{
		$user = User::find($this->factory->user->create([
			'user_email' => 'different@example.com'
		]));
		$user->setCustomerId('different');

		// mock the requests in the container
		$this->api_request->shouldReceive('makeRequest')
			->once()
			->withSomeOfArgs('customer_links/testid')
			->andReturn((object) [
				"id" => "10271106-8d03-4b3e-96a9-b52c1c6336da",
				"object" => "customer_link",
				"email" => "newaccount@example.com",
				"expired" => false,
				"first_used_at" => 1644273782,
				"return_url" => "https://example.com",
				"customer" => "testcustomerid",
				"created_at" => 1644273782,
				"updated_at" => 1644273782
			]);


		$request = \Mockery::mock(RequestInterface::class);
		$request->shouldReceive('query')->with('customer_link_id')->andReturn('testid');
		$request->shouldReceive('getUrl')->andReturn('https://example.com');

		$this->subject->shouldNotReceive('error');
		$this->subject->shouldReceive('success')->once()->andReturn('redirect');

		$this->subject->handle($request, function () {});

		// user is logged in.
		$current_user = User::current();
		// user account is created.
		$this->assertSame($current_user->user_email, 'newaccount@example.com');
		$this->assertSame($current_user->customerId(), 'testcustomerid');
	}

	/**
	 * Should not create a customer or user if no customer id is provided.
	 */
	public function test_should_not_create_user_if_no_customer_id_provided()
	{
		$user = User::find($this->factory->user->create([
			'user_email' => 'different@example.com'
		]));
		$user->setCustomerId('different');

		// mock the requests in the container
		$this->api_request->shouldReceive('makeRequest')
			->once()
			->withSomeOfArgs('customer_links/testid')
			->andReturn((object) [
				"id" => "10271106-8d03-4b3e-96a9-b52c1c6336da",
				"object" => "customer_link",
				"email" => "newaccount@example.com",
				"expired" => false,
				"first_used_at" => 1644273782,
				"return_url" => "https://example.com",
				"customer" => null,
				"created_at" => 1644273782,
				"updated_at" => 1644273782
			]);


		$request = \Mockery::mock(RequestInterface::class);
		$request->shouldReceive('query')->with('customer_link_id')->andReturn('testid');

		$this->subject->shouldReceive('error')->once()->with(\Mockery::on(function ($error) {
			$this->assertSame('user_not_found', $error->get_error_code());
			return $error->get_error_code() === 'user_not_found';
		}));

		$next = $this->subject->handle($request, function () {
			return 'redirect';
		});

		$this->assertNotTrue(is_user_logged_in());
	}

	public function test_should_login_if_wordpress_user_matches_email()
	{
		$user = User::find($this->factory->user->create([
			'user_email' => 'customer@example.com'
		]));

		// mock the requests in the container
		$this->api_request->shouldReceive('makeRequest')
			->once()
			->withSomeOfArgs('customer_links/testid')
			->andReturn((object) [
				"id" => "10271106-8d03-4b3e-96a9-b52c1c6336da",
				"object" => "customer_link",
				"email" => "customer@example.com",
				"expired" => false,
				"first_used_at" => 1644273782,
				"return_url" => "https://example.com",
				"customer" => "testcustomerid",
				"created_at" => 1644273782,
				"updated_at" => 1644273782
			]);


		$request = \Mockery::mock(RequestInterface::class, RequestInterface::class);
		$request->shouldReceive('query')->with('customer_link_id')->andReturn('testid');
		$request->shouldReceive('getUrl')->andReturn('https://example.com');

		$this->subject->shouldNotReceive('error');

		// run function.
		$this->subject->handle($request, function () {
			return 'redirect';
		});

		// user is logged in.
		$current_user = wp_get_current_user();
		$this->assertSame($user->ID, $current_user->ID);
	}

	public function test_should_login_if_customer_id_matches_a_wordpress_user()
	{
		// admin check
		// login regardless if emails match
		$user = User::find($this->factory->user->create([
			'user_email' => 'different@example.com'
		]));
		$user->setCustomerId('testcustomerid');

		// mock the requests in the container
		$this->api_request->shouldReceive('makeRequest')
			->once()
			->withSomeOfArgs('customer_links/testid')
			->andReturn((object) [
				"id" => "10271106-8d03-4b3e-96a9-b52c1c6336da",
				"object" => "customer_link",
				"email" => "customer@example.com",
				"expired" => false,
				"first_used_at" => 1644273782,
				"return_url" => "https://example.com",
				"customer" => "testcustomerid",
				"created_at" => 1644273782,
				"updated_at" => 1644273782
			]);


		$request = \Mockery::mock(RequestInterface::class);
		$request->shouldReceive('query')->with('customer_link_id')->andReturn('testid');
		$request->shouldReceive('getUrl')->andReturn('https://example.com');

		$this->subject->shouldNotReceive('error');
		$this->subject->handle($request, function () {
		});

		// user is logged in.
		$current_user = wp_get_current_user();
		$this->assertSame($user->ID, $current_user->ID);
	}
}

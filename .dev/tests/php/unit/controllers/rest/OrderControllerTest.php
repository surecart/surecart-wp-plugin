<?php

namespace SureCart\Tests\Controllers\Rest;

use SureCart\Controllers\Rest\OrderController;
use SureCart\Models\Order;
use SureCart\Models\User;
use SureCart\Tests\SureCartUnitTestCase;
use WP_REST_Request;

class OrderControllerTest extends SureCartUnitTestCase
{
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp()
	{
		// Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers' => [
				\SureCart\Request\RequestServiceProvider::class,
				\SureCart\Support\Errors\ErrorsServiceProvider::class,
				\SureCart\WordPress\PluginServiceProvider::class
			]
		], false);

		parent::setUp();
	}

	/**
	 * Middleware gets called.
	 */
	public function test_middlewareGetsCalled()
	{
		$request = new WP_REST_Request('POST', '/surecart/v1/orders', [
			'form_id' => 1,
		]);

		$model = \Mockery::mock(Order::class)->makePartial();
		$model->shouldAllowMockingProtectedMethods()->shouldReceive('where')->once()->andReturn($model);
		$model->shouldAllowMockingProtectedMethods()->shouldReceive('create')->once()->andReturn($model);

		$controller = \Mockery::mock(OrderController::class)->makePartial();
		$controller->shouldAllowMockingProtectedMethods()->shouldReceive('middleware')->once()->andReturn($model);
		$controller->create($request);
	}

	/**
	 * Test login credentials validation.
	 */
	public function test_maybeValidateLoginCreds() {
		self::factory()->user->create_and_get([
			'user_login' => 'testuser',
			'user_email' => 'testuser@test.com',
			'user_pass' => 'testpassword',
		]);

		$is_valid = (new OrderController())->maybeValidateLoginCreds('testuser@test.com', 'incorrectpassword');
		$this->assertWPError($is_valid);

		$is_valid = (new OrderController())->maybeValidateLoginCreds('testuser@test.com', 'testpassword');
		$this->assertNotWPError($is_valid);
	}

	/**
	 * Test validation.
	 */
	public function test_validate() {
		$request = new WP_REST_Request('POST', '/surecart/v1/orders/finalize');
		$request->set_param('email', 'testuser@test.com');
		$request->set_param('password', 'pass123');

		$controller = \Mockery::mock(OrderController::class)->makePartial();
		$controller->shouldReceive('maybeValidateLoginCreds')
			->with('testuser@test.com', 'pass123')
			->once()
			->andReturn(true);

		// no errors.
		$errors = $controller->validate([], $request);
		$this->assertWPError($errors);
		$this->assertFalse($errors->has_errors());

		$controller->shouldReceive('maybeValidateLoginCreds')
			->with('testuser@test.com', 'pass123')
			->once()
			->andReturn(new \WP_Error('error', 'Error happened'));

		$errors = $controller->validate([], $request);
		$this->assertWPError($errors);
		$this->assertTrue($errors->has_errors());
	}

	public function test_maybeLinkCustomer() {
		$request = new WP_REST_Request('POST', '/surecart/v1/orders/finalize');
		$request->set_param('email', 'testuser@test.com');
		$request->set_param('password', 'pass123');

		// non-paid order should just return the order.
		$this->assertFalse((new OrderController())->maybeLinkCustomer(new Order(['status' => 'finalized']), $request));

		// paid order should run linkCustomerID method.
		$paid_order = new Order(['status' => 'paid']);
		$controller = \Mockery::mock(OrderController::class)->makePartial();
		$controller->shouldReceive('linkCustomerId')
			->with($paid_order, $request)
			->once();
	    $controller->maybeLinkCustomer($paid_order, $request);
	}

	public function test_finalize() {
		// finalized order
		$finalized_order = (object) [
			'id' => 'testid',
			'object' => 'order',
			'customer' => 'anybody',
			'status' => 'finalized'
		];

		// set up request.
		$request = new WP_REST_Request('POST', '/surecart/v1/orders/testorder/finalize');
		$request->set_param('id', 'test_order');
		$request->set_param('processor_type', 'stripe');

		// mock controller.
		$controller = \Mockery::mock(OrderController::class)->makePartial();
		// mock the requests in the container
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		// validate first.
		$controller->shouldReceive('validate')
			->once()
			->andReturn(new \WP_Error());
		// then make the request.
		$requests->shouldReceive('makeRequest')
			->atLeast()
			->once()
			->withSomeOfArgs('orders/test_order/finalize/')
			->andReturn($finalized_order);
		// then maybe link the customer.
		$controller->shouldReceive('maybeLinkCustomer')
			->once();

		// finalize the order.
		$controller_order = $controller->finalize($request);

		// assert that the order is the same.
		$this->assertSame($finalized_order->id, $controller_order->id);
	}

	/**
	 * @group rest
	 * @group integration
	 */
	public function test_confirm() {
		// set up request.
		$request = new WP_REST_Request('POST', '/surecart/v1/orders/testorder/finalize');
		$request->set_param('id', 'test_order');
		$request->set_param('processor_type', 'stripe');

		// mock controller.
		$controller = \Mockery::mock(OrderController::class)->makePartial();
		// mock the requests in the container
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		/**
		 * Finalize responses should error out.
		 */
		$requests->shouldReceive('makeRequest')
			->once()
			->withSomeOfArgs('orders/test_order')
			->andReturn((object) [
				'status' => 'finalized',
			]);

		// finalize the order.
		$controller_order = $controller->confirm($request);

		// assert that the order is the same.
		$this->assertWPError($controller_order);

		/**
		 * Paid requests should validate.
		 */
		$paid_order =  json_decode(file_get_contents(dirname(__FILE__) . '/paid-order.json'));

		$requests->shouldReceive('makeRequest')
			->once()
			->withSomeOfArgs('orders/test_order')
			->andReturn($paid_order);

		// finalize the order.
		$controller_order = $controller->confirm($request);

		// assert that the order is the same.
		$this->assertNotWPError($controller_order);
		$this->assertSame($controller_order->status, 'paid');
		$this->assertSame($controller_order->email, 'test@test.com');
		$this->assertSame(1, did_action('surecart/purchase_created'), 'Purchase created action was not called');
		$this->assertSame(1, did_action('surecart/order_confirmed'), 'Order confirmed action was not called');
	}

	public function test_linkCustomerId() {
		$user = User::find(self::factory()->user->create())
			->setCustomerId('testcustomerid');
		$wrong = (new OrderController())->linkCustomerId(new Order(['customer'=> 'wrong', 'email' => 'wrong@email.com', 'live_mode' => true]), new WP_REST_Request());
		$this->assertNotSame($wrong->ID, $user->ID);
		$correct = (new OrderController())->linkCustomerId(new Order(['customer'=> 'testcustomerid', 'email' => 'any@email.com', 'live_mode' => true]), new WP_REST_Request());
		$this->assertSame($correct->ID, $user->ID , 'User should be linked to order based on customer id.');

		// a user should be given a customer id if they don't have one.
		$user_not_yet_customer = User::find(self::factory()->user->create([
			'user_email' => 'usernotyetcustomer@email.com'
		]));
		$this->assertNotEmpty($user_not_yet_customer->user_email);
		$user = (new OrderController())->linkCustomerId(new Order(['customer'=> 'anewcustomerid', 'email' => $user_not_yet_customer->user_email, 'live_mode' => true]), new WP_REST_Request());
		$this->assertSame($user_not_yet_customer->ID, $user->ID, 'An existing user should be linked to an order based on email.');
		$this->assertSame($user_not_yet_customer->customerId(), 'anewcustomerid', 'An existing user is not given a customer id.');

		// new user
		$user = (new OrderController())->linkCustomerId(new Order(['customer'=> 'usernotexists', 'email' => 'user_not_exist', 'live_mode' => true]), new WP_REST_Request());
		$this->assertNotEmpty($user, 'A new user should be created.');
		$this->assertNotEmpty($user->customerId(), 'A new user should be given a customer id.');
	}

}

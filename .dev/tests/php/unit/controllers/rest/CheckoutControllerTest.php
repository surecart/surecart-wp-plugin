<?php

namespace SureCart\Tests\Controllers\Rest;

use SureCart\Controllers\Rest\CheckoutsController;
use SureCart\Models\Checkout;
use SureCart\Models\User;
use SureCart\Tests\SureCartUnitTestCase;
use WP_REST_Request;

class CheckoutsControllerTest extends SureCartUnitTestCase
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
		$request = new WP_REST_Request('POST', '/surecart/v1/checkouts', [
			'form_id' => 1,
		]);

		$model = \Mockery::mock(Checkout::class)->makePartial();
		$model->shouldAllowMockingProtectedMethods()->shouldReceive('where')->once()->andReturn($model);
		$model->shouldAllowMockingProtectedMethods()->shouldReceive('create')->once()->andReturn($model);

		$controller = \Mockery::mock(CheckoutsController::class)->makePartial();
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

		$is_valid = (new CheckoutsController())->maybeValidateLoginCreds('testuser@test.com', 'incorrectpassword');
		$this->assertWPError($is_valid);

		$is_valid = (new CheckoutsController())->maybeValidateLoginCreds('testuser@test.com', 'testpassword');
		$this->assertNotWPError($is_valid);
	}

	/**
	 * Test validation.
	 */
	public function test_validate() {
		$request = new WP_REST_Request('POST', '/surecart/v1/checkouts/finalize');
		$request->set_param('email', 'testuser@test.com');
		$request->set_param('password', 'pass123');

		$controller = \Mockery::mock(CheckoutsController::class)->makePartial();
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

	public function test_finalize() {
		// finalized checkout
		$finalized_checkout = (object) [
			'id' => 'testid',
			'object' => 'checkout',
			'customer' => 'anybody',
			'status' => 'finalized'
		];

		// set up request.
		$request = new WP_REST_Request('POST', '/surecart/v1/checkouts/testcheckout/finalize');
		$request->set_param('id', 'test_checkout');
		$request->set_param('processor_type', 'stripe');

		// mock controller.
		$controller = \Mockery::mock(CheckoutsController::class)->makePartial();
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
			->withSomeOfArgs('checkouts/test_checkout/finalize/')
			->andReturn($finalized_checkout);
		// finalize the checkout.
		$controller_checkout = $controller->finalize($request);

		// assert that the checkout is the same.
		$this->assertSame($finalized_checkout->id, $controller_checkout->id);
	}

	/**
	 * @group rest
	 * @group integration
	 */
	public function test_confirm() {
		// set up request.
		$request = new WP_REST_Request('POST', '/surecart/v1/checkouts/testcheckout/finalize');
		$request->set_param('id', 'test_checkout');
		$request->set_param('processor_type', 'stripe');

		// mock controller.
		$controller = \Mockery::mock(CheckoutsController::class)->makePartial();
		// mock the requests in the container
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		/**
		 * Paid requests should validate.
		 */
		$paid_checkout =  json_decode(file_get_contents(dirname(__FILE__) . '/fixtures/paid-checkout.json'));

		$requests->shouldReceive('makeRequest')
			->once()
			->withSomeOfArgs('checkouts/test_checkout')
			->andReturn($paid_checkout);

		// then maybe link the customer.
		$controller->shouldReceive('linkCustomerId')
			->once();


		// finalize the checkout.
		$controller_checkout = $controller->confirm($request);

		// assert that the checkout is the same.
		$this->assertNotWPError($controller_checkout);
		$this->assertSame($controller_checkout->status, 'paid');
		$this->assertSame($controller_checkout->email, 'test@test.com');
		$this->assertSame(1, did_action('surecart/purchase_created'), 'Purchase created action was not called');
		$this->assertSame(1, did_action('surecart/checkout_confirmed'), 'Checkout confirmed action was not called');
	}

	public function test_linkCustomerId() {
		$user = User::find(self::factory()->user->create())
			->setCustomerId('testcustomerid');
		$wrong = (new CheckoutsController())->linkCustomerId(new Checkout(['customer'=> 'wrong', 'email' => 'wrong@email.com', 'live_mode' => true]), new WP_REST_Request());
		$this->assertNotSame($wrong->ID, $user->ID);
		$correct = (new CheckoutsController())->linkCustomerId(new Checkout(['customer'=> 'testcustomerid', 'email' => 'any@email.com', 'live_mode' => true]), new WP_REST_Request());
		$this->assertSame($correct->ID, $user->ID , 'User should be linked to checkout based on customer id.');

		// a user should be given a customer id if they don't have one.
		$user_not_yet_customer = User::find(self::factory()->user->create([
			'user_email' => 'usernotyetcustomer@email.com'
		]));
		$this->assertNotEmpty($user_not_yet_customer->user_email);
		$user = (new CheckoutsController())->linkCustomerId(new Checkout(['customer'=> 'anewcustomerid', 'email' => $user_not_yet_customer->user_email, 'live_mode' => true]), new WP_REST_Request());
		$this->assertSame($user_not_yet_customer->ID, $user->ID, 'An existing user should be linked to an checkout based on email.');
		$this->assertSame($user_not_yet_customer->customerId(), 'anewcustomerid', 'An existing user is not given a customer id.');

		// new user
		$user = (new CheckoutsController())->linkCustomerId(new Checkout(['customer'=> 'usernotexists', 'email' => 'user_not_exist', 'live_mode' => true]), new WP_REST_Request());
		$this->assertNotEmpty($user, 'A new user should be created.');
		$this->assertNotEmpty($user->customerId(), 'A new user should be given a customer id.');
	}

}

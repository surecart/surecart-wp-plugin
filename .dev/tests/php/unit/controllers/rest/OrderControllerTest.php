<?php

namespace CheckoutEngine\Tests\Controllers\Rest;

use CheckoutEngine\Controllers\Rest\OrderController;
use CheckoutEngine\Models\Order;
use CheckoutEngine\Models\User;
use CheckoutEngine\Tests\CheckoutEngineUnitTestCase;
use WP_REST_Request;

class OrderControllerTest extends CheckoutEngineUnitTestCase
{
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp()
	{
		// Set up an app instance with whatever stubs and mocks we need before every test.
		\CheckoutEngine::make()->bootstrap([
			'providers' => [
				\CheckoutEngine\Request\RequestServiceProvider::class,
				\CheckoutEngine\Support\Errors\ErrorsServiceProvider::class,
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

	public function createOrLoginUser() {
		$controller = new OrderController();
		$this->assertFalse($controller->createOrLoginUser('email@email.com', '', null));
		$this->assertFalse($controller->createOrLoginUser(null, '', 'password'));

		// create.
		$created = $controller->createOrLoginUser('email@email.com', null, 'password');
		$this->assertTrue($created);
		$this->assertNotFalse(get_user_by('email', 'email@email.com'));
		$current_user = wp_get_current_user();
		$this->assertSame($current_user->user_email, 'email@email.com');

		// login fail.
		$user = $this->factory->user->create_and_get([
			'password' => 'correctpassword'
		]);
		$created = $controller->createOrLoginUser($user->user_email, null, 'notthecorrectpassword');
		$this->assertWPError($created);


		// login success
		$created = $controller->createOrLoginUser($user->user_email, null, 'correctpassword');
		$this->assertNotFalse($created);
		$current_user = wp_get_current_user();
		$this->assertSame($current_user->user_email, $user->user_email);
	}

	/**
	 * @group failing
	 */
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

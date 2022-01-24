<?php

namespace CheckoutEngine\Tests\Controllers\Rest;

use CheckoutEngine\Controllers\Rest\OrderController;
use CheckoutEngine\Models\Order;
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
			]
		], false);

		parent::setUp();
	}

	public function test_middleware()
	{
		$request = new WP_REST_Request('POST', '/checkout-engine/v1/orders', [
			'form_id' => 1,
		]);

		$model = \Mockery::mock(Order::class)->makePartial();
		$model->shouldAllowMockingProtectedMethods()->shouldReceive('where')->once()->andReturn($model);
		$model->shouldAllowMockingProtectedMethods()->shouldReceive('create')->once()->andReturn($model);

		$controller = \Mockery::mock(OrderController::class)->makePartial();
		$controller->shouldAllowMockingProtectedMethods()->shouldReceive('middleware')->once()->andReturn($model);
		$controller->create($request);
	}

	public function test_validate() {
		$request = new WP_REST_Request('POST', '/checkout-engine/v1/orders/finalize');
		$request->set_param('email', 'testuser@test.com');
		$request->set_param('password', 'pass123');


		$controller = \Mockery::mock(OrderController::class)->makePartial();
		$controller->shouldAllowMockingProtectedMethods()
			->shouldReceive('createOrLoginUser')
			->with('testuser@test.com', '', 'pass123')
			->once();

		// no errors.
		$errors = $controller->validate([], $request);
		$this->assertWPError($errors);
		$this->assertFalse($errors->has_errors());

		$controller->shouldAllowMockingProtectedMethods()
			->shouldReceive('createOrLoginUser')
			->with('testuser@test.com', '', 'pass123')
			->once()
			->andReturn(new \WP_Error('error', 'Error happened'));

		$errors = $controller->validate([], $request);
		$this->assertWPError($errors);
		$this->assertTrue($errors->has_errors());
	}

	/**
	 * @group failing
	 */
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
}

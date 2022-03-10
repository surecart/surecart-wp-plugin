<?php
namespace CheckoutEngine\Tests;

use CheckoutEngine\Models\User;
use CheckoutEngine\Request\RequestService;
use CheckoutEngine\Tests\CheckoutEngineUnitTestCase;


class OrderPermissionsTest extends CheckoutEngineUnitTestCase {
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
				\CheckoutEngine\Permissions\RolesServiceProvider::class,
				\CheckoutEngine\WordPress\Pages\PageServiceProvider::class,
				\CheckoutEngine\WordPress\PostTypes\FormPostTypeServiceProvider::class,
				\CheckoutEngine\Activation\ActivationServiceProvider::class,
				\CheckoutEngine\WordPress\PluginServiceProvider::class,
			]
		], false);

		parent::setUp();
	}

	public function test_edit_and_view_draft_permissions()
	{
		\CheckoutEngine::plugin()->activation()->bootstrap();

		// mock the requests in the container
		$requests =  \Mockery::mock(RequestService::class);
		\CheckoutEngine::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		$requests->shouldReceive('makeRequest')
			->atLeast()
			->once()
			->withSomeOfArgs('orders/testid')
			->andReturn((object) [
				'id' => 'testid',
				'object' => 'order',
				'customer' => 'anybody',
				'status' => 'draft'
			]);

		$user = self::factory()->user->create_and_get();

		$this->assertFalse(user_can($user, 'read_ce_orders', 'Users should not be able to read orders by default'));
		$this->assertTrue(user_can($user, 'edit_ce_order', 'testid'), 'Anyone can edit a draft order.');
		$this->assertTrue(user_can($user, 'read_ce_order', 'testid', 'Anyone can read a draft order.'));
	}

	public function test_edit_and_view_paid_completed_permissions() {
		\CheckoutEngine::plugin()->activation()->bootstrap();

		// mock the requests in the container
		$requests =  \Mockery::mock(RequestService::class);
		\CheckoutEngine::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		$requests->shouldReceive('makeRequest')
			->withSomeOfArgs('orders/testid')
			->andReturn((object) [
				'id' => 'testid',
				'object' => 'order',
				'customer' => 'testcustomerid',
				'status' => 'completed'
			]);

		$user = User::find(self::factory()->user->create());
		$user->setCustomerId('testcustomerid');

		$this->assertFalse(user_can($user->ID, 'read_ce_orders'));
		$this->assertFalse(user_can($user->ID, 'edit_ce_order', 'testid'));
		$this->assertTrue(user_can($user->ID, 'read_ce_order', 'testid'));

		$requests->shouldReceive('makeRequest')
		->withSomeOfArgs('orders/testid')
		->andReturn((object) [
			'id' => 'testid',
			'object' => 'order',
			'customer' => 'testcustomerid',
			'status' => 'paid'
		]);

		$this->assertFalse(user_can($user->ID, 'read_ce_orders'));
		$this->assertFalse(user_can($user->ID, 'edit_ce_order', 'testid'));
		$this->assertTrue(user_can($user->ID, 'read_ce_order', 'testid'));
	}

}

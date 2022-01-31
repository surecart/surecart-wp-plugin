<?php
namespace CheckoutEngine\Tests;

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
			->withSomeOfArgs('orders/testid')
			->andReturn((object) [
				'id' => 'testid',
				'object' => 'order',
				'customer' => 'testcustomerid',
				'status' => 'draft'
			]);

		$user = self::factory()->user->create_and_get();
		add_user_meta( $user->ID, 'ce_customer_id', 'testcustomerid' );

		$this->assertFalse(user_can($user, 'read_ce_orders'));
		$this->assertTrue(user_can($user, 'edit_ce_order', 'testid'));
		$this->assertTrue(user_can($user, 'read_ce_order', 'testid'));
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

		$user = self::factory()->user->create_and_get();
		add_user_meta( $user->ID, 'ce_customer_id', 'testcustomerid' );

		$this->assertFalse(user_can($user, 'read_ce_orders'));
		$this->assertFalse(user_can($user, 'edit_ce_order', 'testid'));
		$this->assertTrue(user_can($user, 'read_ce_order', 'testid'));

		$requests->shouldReceive('makeRequest')
		->withSomeOfArgs('orders/testid')
		->andReturn((object) [
			'id' => 'testid',
			'object' => 'order',
			'customer' => 'testcustomerid',
			'status' => 'paid'
		]);

		$this->assertFalse(user_can($user, 'read_ce_orders'));
		$this->assertFalse(user_can($user, 'edit_ce_order', 'testid'));
		$this->assertTrue(user_can($user, 'read_ce_order', 'testid'));
	}

}

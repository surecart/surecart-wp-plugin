<?php
namespace CheckoutEngine\Tests;

use CheckoutEngine\Request\RequestService;
use CheckoutEngine\Tests\CheckoutEngineUnitTestCase;


class CheckoutSessionPermissionsTest extends CheckoutEngineUnitTestCase {
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
			]
		], false);

		parent::setUp();
	}

	public function test_edit_and_view_draft_permissions()
	{
		\CheckoutEngine::createRoles();

		// mock the requests in the container
		$requests =  \Mockery::mock(RequestService::class);
		\CheckoutEngine::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		$requests->shouldReceive('makeRequest')
			->withSomeOfArgs('checkout_sessions/testid')
			->andReturn((object) [
				'id' => 'testid',
				'object' => 'checkout_session',
				'customer' => 'testcustomerid',
				'status' => 'draft'
			]);

		$user = self::factory()->user->create_and_get();
		add_user_meta( $user->ID, 'ce_customer_id', 'testcustomerid' );

		$this->assertFalse(user_can($user, 'read_ce_checkout_sessions'));
		$this->assertTrue(user_can($user, 'edit_ce_checkout_session', 'testid'));
		$this->assertTrue(user_can($user, 'read_ce_checkout_session', 'testid'));
	}

	public function test_edit_and_view_paid_completed_permissions() {
		\CheckoutEngine::createRoles();

		// mock the requests in the container
		$requests =  \Mockery::mock(RequestService::class);
		\CheckoutEngine::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		$requests->shouldReceive('makeRequest')
			->withSomeOfArgs('checkout_sessions/testid')
			->andReturn((object) [
				'id' => 'testid',
				'object' => 'checkout_session',
				'customer' => 'testcustomerid',
				'status' => 'completed'
			]);

		$user = self::factory()->user->create_and_get();
		add_user_meta( $user->ID, 'ce_customer_id', 'testcustomerid' );

		$this->assertFalse(user_can($user, 'read_ce_checkout_sessions'));
		$this->assertFalse(user_can($user, 'edit_ce_checkout_session', 'testid'));
		$this->assertTrue(user_can($user, 'read_ce_checkout_session', 'testid'));

		$requests->shouldReceive('makeRequest')
		->withSomeOfArgs('checkout_sessions/testid')
		->andReturn((object) [
			'id' => 'testid',
			'object' => 'checkout_session',
			'customer' => 'testcustomerid',
			'status' => 'paid'
		]);

		$this->assertFalse(user_can($user, 'read_ce_checkout_sessions'));
		$this->assertFalse(user_can($user, 'edit_ce_checkout_session', 'testid'));
		$this->assertTrue(user_can($user, 'read_ce_checkout_session', 'testid'));
	}

}

<?php
namespace CheckoutEngine\Tests;

use CheckoutEngine\Request\RequestService;
use CheckoutEngine\Tests\CheckoutEngineUnitTestCase;


class ChargesPermissionsTest extends CheckoutEngineUnitTestCase {
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

	public function test_subscription_edit_permissions()
	{
		\CheckoutEngine::createRoles();

		// mock the requests in the container
		$requests =  \Mockery::mock(RequestService::class);
		\CheckoutEngine::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		$requests->shouldReceive('makeRequest')
			->withSomeOfArgs('charges/testid')
			->andReturn((object) [
				'id' => 'testid',
				'object' => 'charges',
				'customer' => 'testcustomerid'
			]);

		$user = self::factory()->user->create_and_get();
		add_user_meta( $user->ID, 'ce_customer_id', 'testcustomerid' );

		$this->assertFalse(user_can($user, 'read_ce_charges'));
		$this->assertTrue(user_can($user, 'edit_ce_charge', 'testid'));
		$this->assertTrue(user_can($user, 'read_ce_charge', 'testid'));
	}

}

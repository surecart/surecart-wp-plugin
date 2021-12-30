<?php
namespace CheckoutEngine\Tests;

use CheckoutEngine\Permissions\Models\SubscriptionPermissionsController;
use CheckoutEngine\Request\RequestService;
use CheckoutEngine\Tests\CheckoutEngineUnitTestCase;


class SubscriptionPermissionsTest extends CheckoutEngineUnitTestCase {
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
			->withSomeOfArgs('subscriptions/testid')
			->andReturn((object) [
				'id' => 'testid',
				'object' => 'subscription',
				'customer' => 'testcustomerid'
			]);

		$user = self::factory()->user->create_and_get();
		add_user_meta( $user->ID, 'ce_customer_id', 'testcustomerid' );

		$this->assertFalse(user_can($user, 'read_pk_subscriptions'));
		$this->assertTrue(user_can($user, 'edit_pk_subscription', 'testid'));
		$this->assertTrue(user_can($user, 'read_pk_subscription', 'testid'));
	}

}

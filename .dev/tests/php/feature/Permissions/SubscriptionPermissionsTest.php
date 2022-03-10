<?php
namespace CheckoutEngine\Tests;

use CheckoutEngine\Models\User;
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
				\CheckoutEngine\WordPress\Pages\PageServiceProvider::class,
				\CheckoutEngine\WordPress\PostTypes\FormPostTypeServiceProvider::class,
				\CheckoutEngine\Activation\ActivationServiceProvider::class,
				\CheckoutEngine\WordPress\PluginServiceProvider::class,
			]
		], false);

		parent::setUp();
	}

	public function test_subscription_edit_permissions()
	{
		\CheckoutEngine::plugin()->activation()->bootstrap();

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

		$user = User::find(self::factory()->user->create());
		$user->setCustomerId('testcustomerid');
		$this->assertFalse(user_can($user->ID, 'read_ce_subscriptions'));
		$this->assertTrue(user_can($user->ID, 'edit_ce_subscription', 'testid'));
	}

}

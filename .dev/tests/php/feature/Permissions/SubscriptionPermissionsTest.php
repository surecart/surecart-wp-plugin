<?php
namespace SureCart\Tests;

use SureCart\Models\User;
use SureCart\Request\RequestService;
use SureCart\Tests\SureCartUnitTestCase;


class SubscriptionPermissionsTest extends SureCartUnitTestCase {
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
				\SureCart\Permissions\RolesServiceProvider::class,
				\SureCart\WordPress\Pages\PageServiceProvider::class,
				\SureCart\WordPress\PostTypes\FormPostTypeServiceProvider::class,
				\SureCart\Activation\ActivationServiceProvider::class,
				\SureCart\WordPress\PluginServiceProvider::class,
			]
		], false);

		parent::setUp();
	}

	public function test_subscription_edit_permissions()
	{
		\SureCart::plugin()->activation()->bootstrap();

		// mock the requests in the container
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
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
		$this->assertFalse(user_can($user->ID, 'read_sc_subscriptions'));
		$this->assertTrue(user_can($user->ID, 'edit_sc_subscription', 'testid', []));
	}

}

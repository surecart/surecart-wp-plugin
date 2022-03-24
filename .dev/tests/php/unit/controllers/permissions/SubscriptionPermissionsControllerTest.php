<?php
namespace SureCart\Tests\Controllers\Permissions;

use SureCart\Models\User;
use SureCart\Permissions\Models\SubscriptionPermissionsController;
use SureCart\Permissions\RolesServiceProvider;
use SureCart\Request\RequestServiceProvider;
use SureCart\Support\Errors\ErrorsServiceProvider;
use SureCart\Tests\SureCartUnitTestCase;

class SubscriptionPermissionsControllerTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp()
	{
		// Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers' => [
				RequestServiceProvider::class,
				RolesServiceProvider::class,
				ErrorsServiceProvider::class
			]
		], false);

		parent::setUp();
	}

	public function test_handle_edit_subscription()
	{
		// mock the requests in the container
		$requests =  \Mockery::mock(RequestService::class);
		\SureCart::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		$user = User::find(self::factory()->user->create());
		$user->setCustomerId('testcustomerid');

		$user_fail = User::find(self::factory()->user->create());
		$user_fail->setCustomerId('testcustomeridfail');

		$requests->shouldReceive('makeRequest')
		->twice()
		->withSomeOfArgs('subscriptions/testid')
		->andReturn([
			'customer' => 'testcustomerid'
		]);

		$controller = new SubscriptionPermissionsController();
		$this->assertTrue($controller->edit_sc_subscription( $user->ID, [null, null, 'testid']));
		$this->assertFalse($controller->edit_sc_subscription( $user_fail->ID, [null, null, 'testid']));
	}
}

<?php
namespace CheckoutEngine\Tests\Controllers\Permissions;

use CheckoutEngine\Permissions\Models\SubscriptionPermissionsController;
use CheckoutEngine\Permissions\RolesServiceProvider;
use CheckoutEngine\Request\RequestServiceProvider;
use CheckoutEngine\Support\Errors\ErrorsServiceProvider;
use CheckoutEngine\Tests\CheckoutEngineUnitTestCase;

class SubscriptionPermissionsControllerTest extends CheckoutEngineUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp()
	{
		// Set up an app instance with whatever stubs and mocks we need before every test.
		\CheckoutEngine::make()->bootstrap([
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
		\CheckoutEngine::alias('request', function () use ($requests) {
			return call_user_func_array([$requests, 'makeRequest'], func_get_args());
		});

		$user = self::factory()->user->create_and_get();
		add_user_meta( $user->ID, 'ce_customer_id', 'testcustomerid' );

		$requests->shouldReceive('makeRequest')
		->once()
		->withSomeOfArgs('subscriptions/testid')
		->andReturn([
			'customer' => 'testcustomerid'
		]);

		$controller = new SubscriptionPermissionsController();
		$this->assertTrue($controller->edit_ce_subscription( $user, [null, null, 'testid']));
	}
}

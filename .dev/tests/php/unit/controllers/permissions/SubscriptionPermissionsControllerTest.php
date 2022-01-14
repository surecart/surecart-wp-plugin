<?php
namespace CheckoutEngine\Tests\Controllers\Permissions;

use CheckoutEngine\Permissions\Models\SubscriptionPermissionsController;
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
				ErrorsServiceProvider::class
			]
		], false);

		parent::setUp();
	}

	public function test_handle_edit_subscription()
	{
		$subscription =  \Mockery::mock(SubscriptionPermissionsController::class)->shouldAllowMockingProtectedMethods()->makePartial();
		$user = self::factory()->user->create_and_get();

		$subscription->shouldReceive('belongsToUser')
			->once()
			->andReturn(true);

		$subscription->shouldReceive('edit_ce_subscription')
			->once()
			->with('customerid', ['edit_ce_subscription', $user->ID, 'testid'])
			->andReturn(true);

		$subscription->handle( [], ['edit_ce_subscription'], ['edit_ce_subscription', $user->ID, 'testid'], $user);
	}
}

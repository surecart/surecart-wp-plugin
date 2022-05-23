<?php

namespace SureCart\Tests\Integrations;

use SureCart\Integrations\LearnDash\LearnDashService;
use SureCart\Models\Integration;
use SureCart\Models\User;
use SureCart\Tests\SureCartUnitTestCase;

class LearnDashServiceTest extends SureCartUnitTestCase
{
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
			]
		], false);

		parent::setUp();
	}

	public function purchaseTriggerMocks() {
		$service = \Mockery::mock(LearnDashService::class)->makePartial();
		$wp_user = self::factory()->user->create_and_get();
		$user = \Mockery::mock(User::class)->makePartial();
		$purchase = \Mockery::mock(Purchase::class)->makePartial();

		$purchase->shouldReceive('getUser')->atLeast()->once()->andReturn($user->find($wp_user->ID));
		$user->shouldReceive('getWPUser')->atLeast()->once()->andReturn($wp_user);

		$integration = (object)['id' => 'test', 'integration_id' => 'test_id'];
		$service->bootstrap();
		$service->shouldReceive('getIntegrationsFromPurchase')->atLeast()->once()->andReturn([$integration]);

		return [$service, $integration, $wp_user, $purchase];
	}

	/**
	 * @group integration
	 */
	public function test_purchaseCreatedTrigger() {
		[$service, $integration, $wp_user, $purchase] = $this->purchaseTriggerMocks();

		$service->shouldReceive('onPurchaseCreated')->once()->with($integration, $wp_user);
		do_action('surecart/purchase_created', $purchase);
	}

	/**
	 * @group integration
	 */
	public function test_purchaseRevokedTrigger() {
		[$service, $integration, $wp_user, $purchase] = $this->purchaseTriggerMocks();

		$service->shouldReceive('onPurchaseRevoked')->once()->with($integration, $wp_user);
		do_action('surecart/purchase_revoked', $purchase);
	}


	/**
	 * @group integration
	 */
	public function test_purchaseInvokedTrigger() {
		[$service, $integration, $wp_user, $purchase] = $this->purchaseTriggerMocks();

		$service->shouldReceive('onPurchaseInvoked')->once()->with($integration, $wp_user);
		do_action('surecart/purchase_invoked', $purchase);
	}

	public function test_purchaseQuantityUpdatedTrigger() {
		[$service, $integration, $wp_user, $purchase] = $this->purchaseTriggerMocks();

		$service->shouldReceive('onPurchaseInvoked')->once()->with($integration, $wp_user);
		do_action('surecart/purchase_invoked', $purchase);
	}
}

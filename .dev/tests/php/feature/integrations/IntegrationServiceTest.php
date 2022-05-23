<?php

namespace SureCart\Tests\Integrations;

use SureCart\Integrations\IntegrationService;
use SureCart\Models\Purchase;
use SureCart\Tests\SureCartUnitTestCase;

class IntegrationServiceTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;
	/**
	 * @group integration
	 */
	public function test_getActionMethod()
	{
		$service = \Mockery::mock( IntegrationService::class )->makePartial();
		$this->assertSame('onPurchaseCreated', $service->getActionMethod('surecart/purchase_created') );
		$this->assertSame('onPurchaseRevoked', $service->getActionMethod('surecart/purchase_revoked') );
		$this->assertSame('onPurchaseInvoked', $service->getActionMethod('surecart/purchase_invoked') );
		$this->assertNull($service->getActionMethod('surecart/nothing'));
	}

	/**
	 * @group integration
	 *
	 * @return void
	 */
	public function test_onPurchaseUpdatedCallsQuantityUpdated() {
		$service = \Mockery::mock( IntegrationService::class )->makePartial();

		$purchase = new Purchase([
			'id' => 1,
			'integration_id' => 'test_id',
			'quantity' => 1,
		]);

		$integration = (object) ['id' => 'test', 'integration_id' => 'test_id'];
		$wp_user = self::factory()->user->create_and_get();

		$service->shouldReceive('onPurchaseQuantityUpdated')->once()->with(1,2, $integration, $wp_user)->andReturn(null);
		$service->shouldReceive('getIntegrationData')->once()->andReturn([
			[$integration],
			$wp_user
		]);
		$service->onPurchaseUpdated($purchase, [
			'data' => [
				'object' => [
					'quantity' => 1,
					'product' => 'test'
				],
				'previous_attributes' => [
					'quantity' => 2
				]
			]
		]);
	}

	/**
	 * @group integration
	 *
	 * @return void
	 */
	public function test_onPurchaseUpdatedCallsRevokedAndCreated() {
		$service = \Mockery::mock( IntegrationService::class )->makePartial();

		$purchase = new Purchase([
			'id' => 1,
			'integration_id' => 'test_id',
			'quantity' => 1,
		]);

		$request = [
			'data' => [
				'object' => [
					'quantity' => 1,
					'product' => 'test'
				],
				'previous_attributes' => [
					'product' => 'test2'
				]
			]
		];

		$service->shouldReceive('getIntegrationData')->atLeast()->once()->andReturn([
			[(object)['id' => 'test', 'integration_id' => 'test_id']],
			self::factory()->user->create_and_get()
		]);
		$service->shouldReceive('onPurchaseCreated')->once();
		$purchase['product'] = 'test2';
		$service->shouldReceive('onPurchaseRevoked')->once();
		$service->onPurchaseUpdated($purchase, $request);
	}
}

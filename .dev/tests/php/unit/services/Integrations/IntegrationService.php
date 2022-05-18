<?php

namespace SureCart\Tests\Services\Integrations;

use SureCart\Integrations\IntegrationService;
use SureCart\Models\Purchase;
use SureCart\Tests\SureCartUnitTestCase;

class IntegrationServiceTest extends SureCartUnitTestCase
{
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

	/**
	 * Test to make sure the action method is called correctly.
	 */
	public function test_getActionMethod() {
		$stub = $this->getMockForAbstractClass(IntegrationService::class);
		$this->assertSame($stub->getActionMethod('surecart/purchase_created'), 'onPurchaseCreated');
		$this->assertSame($stub->getActionMethod('surecart/purchase_invoked'), 'onPurchaseInvoked');
		$this->assertSame($stub->getActionMethod('surecart/purchase_revoked'), 'onPurchaseRevoked');
	}


	/**
	 * Test to make sure we get the correct integration data.
	 *
	 * @group failing
	 */
	public function test_getIntegrationData() {
		$stub = $this->getMockForAbstractClass(IntegrationService::class);
		$purchase = \Mockery::mock(Purchase::class);
		$purchase->shouldReceive('getUser')->andReturn(null);
		$this->assertNull($stub->getIntegrationData($purchase));

		$purchase = \Mockery::mock(Purchase::class);
		$purchase->shouldReceive('getUser')->andReturn((object)[
			'user' => (object) [
				'getUser' => null
			]
		]);
		$this->assertNull($stub->getIntegrationData($purchase));
	}
}

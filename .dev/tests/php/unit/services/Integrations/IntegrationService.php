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
	 * Test to make sure we get the correct integration data.
	 *
	 * @group integration
	 */
	public function test_getIntegrationData() {
		$mock = \Mockery::mock(IntegrationService::class)->makePartial();
		$mock->shouldReceive('getIntegrationsFromPurchase')->once()->andReturn([]);
		$this->assertEmpty($mock->getIntegrationData(new Purchase(['id' => 'test'])));
	}
}

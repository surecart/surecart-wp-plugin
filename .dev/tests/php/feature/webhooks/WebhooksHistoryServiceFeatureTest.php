<?php

namespace CheckoutEngine\Tests\Unit\Services;

use CheckoutEngine\Tests\CheckoutEngineUnitTestCase;
use CheckoutEngine\Webhooks\WebHooksHistoryService;

/**
 * @group webhooks
 */
class WebhooksHistoryServiceFeatureTest extends CheckoutEngineUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp()
	{
		// Set up an app instance with whatever stubs and mocks we need before every test.
		\CheckoutEngine::make()->bootstrap([
			'providers' => [
				\CheckoutEngine\WordPress\Pages\PageServiceProvider::class,
				\CheckoutEngine\Routing\AdminRouteServiceProvider::class,
				\CheckoutEngine\WordPress\PluginServiceProvider::class,
				\CheckoutEngine\Request\RequestServiceProvider::class,
				\CheckoutEngine\Permissions\RolesServiceProvider::class,
			]
		], false);

		parent::setUp();
	}

	/**
	 * @group failing
	 */
	public function test_stores_previous_domain_when_domain_changes()
	{
		$service = new WebHooksHistoryService();
		$this->assertEmpty($service->getPreviousDomain());
		$this->assertFalse($service->maybeShowDomainChangeNotice());

		$service->setPreviousWebhook(['id' => 'asdf', 'url' => 'foo.com']);
		$this->assertSame('foo.com', $service->getPreviousDomain());

		ob_start();
		$service->maybeShowDomainChangeNotice();
		$result = ob_get_clean();
		$this->assertStringContainsString('action=remove_webhook', $result);
		$this->assertStringContainsString('action=ignore_webhook', $result);
	}
}

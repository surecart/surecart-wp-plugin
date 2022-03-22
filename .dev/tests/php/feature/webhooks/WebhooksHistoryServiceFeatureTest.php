<?php

namespace SureCart\Tests\Unit\Services;

use SureCart\Tests\SureCartUnitTestCase;
use SureCart\Webhooks\WebHooksHistoryService;

/**
 * @group webhooks
 */
class WebhooksHistoryServiceFeatureTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp()
	{
		// Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers' => [
				\SureCart\WordPress\Pages\PageServiceProvider::class,
				\SureCart\Routing\AdminRouteServiceProvider::class,
				\SureCart\WordPress\PluginServiceProvider::class,
				\SureCart\Request\RequestServiceProvider::class,
				\SureCart\Permissions\RolesServiceProvider::class,
			]
		], false);

		parent::setUp();
	}


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

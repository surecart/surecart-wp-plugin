<?php

namespace SureCart\Tests\Unit\Services;

use SureCart\Support\Encryption;
use SureCart\Tests\SureCartUnitTestCase;
use SureCart\Webhooks\WebHooksHistoryService;

/**
 * @group webhooks
 */
class WebhooksHistoryServiceFeatureTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	private WebHooksHistoryService $service;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp()
	{
		// Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers' => [
				\SureCart\Settings\SettingsServiceProvider::class,
				\SureCart\WordPress\Pages\PageServiceProvider::class,
				\SureCart\Routing\AdminRouteServiceProvider::class,
				\SureCart\WordPress\PluginServiceProvider::class,
				\SureCart\Request\RequestServiceProvider::class,
				\SureCart\Permissions\RolesServiceProvider::class,
				\SureCart\Background\BackgroundServiceProvider::class,
				\SureCart\View\ViewServiceProvider::class,
			]
		], false);

		$this->service = new WebHooksHistoryService();

		parent::setUp();
	}

	public function test_show_webhook_notices_when_domain_changes()
	{
		$this->assertEmpty($this->service->getRegisteredWebhook());
		$this->assertNull($this->service->maybeShowDomainChangeNotice());

		$this->service->saveRegisteredWebhook(
			[
				'id'  		     => 'asdf',
				'url' 			 => 'https://foo.com',
				'webhook_events' => ['test'],
				'signing_secret' => Encryption::encrypt( '1234' ),
			],
		);
		$this->assertSame('asdf', $this->service->getRegisteredWebhook()['id']);
		$this->assertSame('https://foo.com', $this->service->getRegisteredWebhook()['url']);

		// change the domain.
		$mock_service = \Mockery::mock($this->service)->makePartial();
		$mock_service->shouldReceive('domainMatches')->once()->andReturn(false);

		ob_start();
		$this->service->maybeShowDomainChangeNotice();
		$result = ob_get_clean();

		$this->assertStringContainsString('action=update_webhook', $result);
		$this->assertStringContainsString('action=create_webhook', $result);
	}
}

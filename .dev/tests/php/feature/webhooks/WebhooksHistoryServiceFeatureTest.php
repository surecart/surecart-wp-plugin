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
			]
		], false);

		$this->service = new WebHooksHistoryService();

		parent::setUp();
	}

	public function test_webhook_notice_is_shown()
	{
		ob_start();
		$this->service->maybeShowDomainChangeNotice();
		$result = ob_get_clean();

		$this->assertStringContainsString('action=create_webhook', $result);
	}

	public function test_webhook_notice_is_not_shown_if_already_registered()
	{
		$this->service->saveRegisteredWebhook(
			[
				'id'  		     => 'asdf',
				'url' 			 => 'http://test.com',
				'webhook_events' => ['test'],
				'signing_secret' => Encryption::encrypt( '1234' ),
			],
		);

		$this->assertCount(1, $this->service->getRegisteredWebhooks());

		ob_start();
		$this->service->maybeShowDomainChangeNotice();
		$result = ob_get_clean();

		$this->assertEmpty($result);
	}

	public function test_webhook_notice_shown_on_url_change()
	{
		$this->service->saveRegisteredWebhook(
			[
				'id'  		     => 'asdf',
				'url' 			 => 'https://test.com', // https url, but our current listener url is http
				'webhook_events' => ['test'],
				'signing_secret' => Encryption::encrypt( '1234' ),
			],
		);

		$this->assertArrayHasKey('id', $this->service->getPreviousWebhook());
		$this->assertContains('https://test.com', $this->service->getPreviousWebhook()['url']);

		ob_start();
		$this->service->maybeShowDomainChangeNotice();
		$result = ob_get_clean();

		$this->assertStringContainsString('action=ignore_webhook', $result);
		$this->assertStringContainsString('action=create_webhook', $result);
		$this->assertStringContainsString('action=update_webhook', $result);
		$this->assertStringContainsString('action=remove_webhook', $result);
	}
}

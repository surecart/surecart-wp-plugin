<?php

namespace SureCart\Tests\Unit\Services;

use SureCart\Support\Encryption;
use SureCart\Tests\SureCartUnitTestCase;
use SureCart\Webhooks\WebHooksHistoryService;
use SureCartCore\View\ViewService;

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

		$registered_webhook = [
			'id'  		     => 'asdf',
			'url' 			 => 'https://foo.com',
			'webhook_events' => ['test'],
			'signing_secret' => Encryption::encrypt('1234'),
		];

		$this->service->saveRegisteredWebhook($registered_webhook);
		$this->assertSame('asdf', $this->service->getRegisteredWebhook()['id']);
		$this->assertSame('https://foo.com', $this->service->getRegisteredWebhook()['url']);

		$view_service = \Mockery::mock(ViewService::class)->makePartial();
		\SureCart::alias('views', function () use ($view_service) {
			return $view_service;
		});
		$view_service
			->shouldReceive('render')
			->once()
			->andReturn(
				[
					'update_url' => \SureCart::getUrl()->editModel( 'update_webhook', $registered_webhook['id'] ),
					'add_url'    => \SureCart::getUrl()->editModel( 'create_webhook', '0' ),
				]
			);

		$result = $this->service->maybeShowDomainChangeNotice();

		$this->assertArrayHasKey('update_url', $result ?? []);
		$this->assertArrayHasKey('add_url', $result ?? []);
		$this->assertSame(
			\SureCart::getUrl()->editModel( 'update_webhook', $registered_webhook['id'] ),
			$result['update_url']
		);
	}
}

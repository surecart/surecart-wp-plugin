<?php

namespace SureCart\Tests\Unit\Services;

use SureCart\Models\RegisteredWebhook;
use SureCart\Models\WebhookRegistration;
use SureCart\Tests\SureCartUnitTestCase;
use SureCart\Webhooks\WebhooksService;
use SureCart\WordPress\Admin\Notices\AdminNoticeService;

/**
 * @group webhooks
 */
class WebhookServiceTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp()
	{
		// Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers' => [
				\SureCart\WordPress\PluginServiceProvider::class,
				\SureCart\Webhooks\WebhooksServiceProvider::class,
			]
		], false);

		parent::setUp();
	}

	public function test_does_not_create_if_no_token()
	{
		$webhook = \Mockery::mock(RegisteredWebhook::class)->shouldAllowMockingProtectedMethods();
		$service = \Mockery::mock(WebhooksService::class, [$webhook])->makePartial();

		// does not have a token.
		$service->shouldReceive('hasToken')->once()->andReturn(false);

		// should not get or create.
		$webhook->shouldNotReceive('get');
		$webhook->shouldNotReceive('create');

		$service->maybeCreate();
	}

	public function test_does_not_create_if_already_registered()
	{
		$webhook = \Mockery::mock(RegisteredWebhook::class)->shouldAllowMockingProtectedMethods();
		$service = \Mockery::mock(WebhooksService::class, [$webhook])->makePartial();

		// has a token.
		$service->shouldReceive('hasToken')->once()->andReturn(true);

		// has a webhook.
		$webhook->shouldReceive('get')->once()->andReturn((object)['id' => 'test']);
		$webhook->shouldNotReceive('create');

		$service->maybeCreate();
	}

	public function test_handles_registration_error()
	{
		$webhook = \Mockery::mock(RegisteredWebhook::class)->shouldAllowMockingProtectedMethods();
		$service = \Mockery::mock(WebhooksService::class, [$webhook])->makePartial();
		// mock the notices in the container
		$notices =  \Mockery::mock(AdminNoticeService::class);
		\SureCart::alias('notices', function () use ($notices) {
			return $notices;
		});

		// has a token.
		$service->shouldReceive('hasToken')->once()->andReturn(true);

		// has not registered
		$webhook->shouldReceive('get')->once()->andReturn((object)[]);

		// shou
		$webhook->shouldReceive('create')->once()->andReturn(new \WP_Error('test', 'Test Error.'));

		// should add error.
		$notices->shouldReceive('add')->with([
			'name'  => 'webhooks_registration_error',
			'type'  => 'warning',
			'title' => esc_html__( 'SureCart Webhook Registration Error', 'surecart' ),
			'text'  => '<p>Test Error.</p>',
		])->once();

		// should not test.
		$webhook->shouldNotReceive('test');

		$service->maybeCreate();
	}

	public function test_registers_webhook_and_sends_test() {
		$webhook = \Mockery::mock(RegisteredWebhook::class)->shouldAllowMockingProtectedMethods();
		$service = \Mockery::mock(WebhooksService::class, [$webhook])->makePartial();
		// mock the notices in the container
		$notices =  \Mockery::mock(AdminNoticeService::class);
		\SureCart::alias('notices', function () use ($notices) {
			return $notices;
		});

		// has a token.
		$service->shouldReceive('hasToken')->once()->andReturn(true);

		// has not registered
		$webhook->shouldReceive('get')->once()->andReturn((object)[]);

		// shou
		$webhook->shouldReceive('create')->once()->andReturn($webhook);

		// should test.
		$webhook->shouldReceive('test')->once()->andReturn((object)['id' => 'test']);

		// create.
		$service->maybeCreate();
	}
}

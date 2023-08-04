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
				\SureCart\WordPress\PluginServiceProvider::class
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

	public function test_recreates_webhook_if_not_found() {
		$registration = \Mockery::mock(WebhookRegistration::class)->shouldAllowMockingProtectedMethods();
		$webhook = \Mockery::mock(RegisteredWebhook::class)->shouldAllowMockingProtectedMethods();
		$service = \Mockery::mock(WebhooksService::class, [$webhook])->makePartial();

		// webhook not found.
		$webhook->shouldReceive('get')->andReturn(new \WP_Error('webhook_endpoint.not_found', 'Webhook not found.'));
		$webhook->shouldReceive('registration')->andReturn($registration);
		$registration->shouldReceive('delete')->once();
		$service->shouldReceive('maybeCreate')->andReturn(true);

		// verify.
		$service->verify();
	}

	public function test_should_show_notice_for_general_error() {
		$webhook = \Mockery::mock(RegisteredWebhook::class)->shouldAllowMockingProtectedMethods();
		$service = \Mockery::mock(WebhooksService::class, [$webhook])->makePartial();
		// mock the notices in the container
		$notices =  \Mockery::mock(AdminNoticeService::class);
		\SureCart::alias('notices', function () use ($notices) {
			return $notices;
		});

		// webhook not found.
		$webhook->shouldReceive('get')->once()->andReturn(new \WP_Error('error', 'General Error'));
		$notices->shouldReceive('add')->once()->andReturn(true);

		// verify.
		$service->verify();
	}

	public function test_should_show_grace_period_notice() {
		$webhook = \Mockery::mock(RegisteredWebhook::class)->shouldAllowMockingProtectedMethods();
		$service = \Mockery::mock(WebhooksService::class, [$webhook])->makePartial();
		// mock the notices in the container
		$notices =  \Mockery::mock(AdminNoticeService::class);
		\SureCart::alias('notices', function () use ($notices) {
			return $notices;
		});

		// webhook not found.
		$webhook->shouldReceive('get')->once()->andReturn((object) ['erroring_grace_period_ends_at' => 1690874841]);
		$notices->shouldReceive('add')->once()->andReturn(true);

		// verify.
		$service->verify();
	}

	/**
	 * @group failing
	 */
	public function test_should_keep_track_of_failed_webhook_processes() {
		$webhook = \Mockery::mock(RegisteredWebhook::class)->shouldAllowMockingProtectedMethods();

		// create a random webhook.
		set_transient( 'surecart_webhook_somethingelse', ['id' => 'testid'], MINUTE_IN_SECONDS );
		// this should be empty.
		$this->assertEmpty((new WebhooksService($webhook))->getFailedWebhookProcesses());

		// hasn't been long enough.
		set_transient( 'surecart_webhook_process_testid', ['id' => 'testid', 'created_at' => time() ], MINUTE_IN_SECONDS );
		$this->assertEmpty((new WebhooksService($webhook))->getFailedWebhookProcesses());

		// more than 5 minutes.
		set_transient( 'surecart_webhook_process_testid', ['id' => 'testid', 'created_at' => time() - (11 * MINUTE_IN_SECONDS) ], MINUTE_IN_SECONDS );
		$this->assertNotEmpty((new WebhooksService($webhook))->getFailedWebhookProcesses());
	}
}

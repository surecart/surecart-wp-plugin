<?php

namespace CheckoutEngine\Tests\Unit\Services;

use CheckoutEngine\Models\Webhook;
use CheckoutEngine\Tests\CheckoutEngineUnitTestCase;
use CheckoutEngine\Webhooks\WebHooksDomainService;
use CheckoutEngine\Webhooks\WebhooksService;

/**
 * @group webhooks
 */
class WebhookServiceTest extends CheckoutEngineUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	public function test_does_not_create_webhooks_if_already_registered()
	{
		$domain_service = new WebHooksDomainService();
		$service = \Mockery::mock(WebhooksService::class, [$domain_service])->makePartial();
		$service->shouldReceive('domainMatches')->once()->andReturn(true);
		$service->shouldReceive('hasSigningSecret')->once()->andReturn(true);

		$this->assertNull($service->maybeCreateWebooks());
	}

	public function test_registers_webhooks_if_doesnt_have_signing_secret() {
		$domain_service = new WebHooksDomainService();
		$service = \Mockery::mock(WebhooksService::class, [$domain_service])->makePartial();
		$service->shouldReceive('domainMatches')->once()->andReturn(true);
		$service->shouldReceive('hasSigningSecret')->once()->andReturn(false);
		$service->shouldReceive('register')->once()->andReturn(new Webhook(['signing_secret' => 'secret']));

		$this->assertTrue($service->maybeCreateWebooks()); // created.
		$this->assertSame($service->getSigningSecret(), 'secret'); // stored signing secret.
	}

	public function test_registers_webhooks_if_domain_does_not_match() {
		$domain_service = new WebHooksDomainService();
		$service = \Mockery::mock(WebhooksService::class, [$domain_service])->makePartial();
		$service->shouldReceive('domainMatches')->once()->andReturn(false);
		$service->shouldReceive('register')->once()->andReturn(new Webhook(['signing_secret' => 'secret1']));

		$this->assertTrue($service->maybeCreateWebooks()); // created.
		$this->assertSame($service->getSigningSecret(), 'secret1'); // stored signing secret.
	}
}

<?php

namespace CheckoutEngine\Tests\Unit\Services;

use CheckoutEngine\Models\Webhook;
use CheckoutEngine\Tests\CheckoutEngineUnitTestCase;
use CheckoutEngine\Webhooks\WebHooksDomainService;
use CheckoutEngine\Webhooks\WebhooksService;

/**
 * @group webhooks
 */
class WebhooksDomainServiceFeatureTest extends CheckoutEngineUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * @group failing
	 */
	public function test_stores_previous_domain_when_domain_changes()
	{
		$service = new WebHooksDomainService();
		$this->assertEmpty($service->getPreviousDomain());
		$this->assertFalse($service->maybeShowDomainChangeNotice());

		$service->setPreviousDomain('foo.com');
		$this->assertSame('foo.com', $service->getPreviousDomain());

		ob_start();
		$service->maybeShowDomainChangeNotice();
		$this->assertSame(ob_get_clean(), '<div class="notice notice-error"><p>It looks like this site has moved or has been duplicated. CheckoutEngine has created new webhooks for the domain to prevent purchase sync issues. Should we remove the previous webook?</p><a href="#" class="button button-primary">This is a duplicate site like a staging site.</a><a href="#" class="button button-secondary">My website domain has permanently changed. Remove webhook for http://foo.com</a></div>');
	}
}

<?php

namespace SureCart\Tests\Models\RegisteredWebhook;

use SureCart\Models\RegisteredWebhook;
use SureCart\Tests\SureCartUnitTestCase;

class RegisteredWebhookTest extends SureCartUnitTestCase
{
	public function test_backwards_compatibility()
	{
		update_option('ce_registered_webhook', [
			'id' => 'test',
			'url'            => 'url',
			'webhook_events' => ['test.event'],
			'signing_secret' => 'testsecret'
		]);
		$webhook = RegisteredWebhook::registration()->get();
		$this->assertSame('test', $webhook->id);
		$this->assertSame('url', $webhook->url);
		$this->assertSame(['test.event'], $webhook->webhook_events);
		$this->assertSame('testsecret', $webhook->signing_secret);
	}
}

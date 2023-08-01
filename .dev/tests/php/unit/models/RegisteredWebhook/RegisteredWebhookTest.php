<?php

namespace SureCart\Tests\Models\RegisteredWebhook;

use SureCart\Models\RegisteredWebhook;
use SureCart\Support\Encryption;
use SureCart\Tests\SureCartUnitTestCase;

class RegisteredWebhookTest extends SureCartUnitTestCase
{
	public function test_backwards_compatibility()
	{
		update_option('ce_registered_webhook', [
			'id' => 'test',
			'url'            => 'url',
			'webhook_events' => ['test.event'],
			'signing_secret' => Encryption::encrypt('zMc12r7mGwGYcxa8Wg3i36zy') // this will be encrypted already when stored.
		]);

		$webhook = RegisteredWebhook::registration()->get();
		$this->assertSame('test', $webhook->id);
		$this->assertSame('url', $webhook->url);
		$this->assertSame(['test.event'], $webhook->webhook_events);
		$this->assertSame('zMc12r7mGwGYcxa8Wg3i36zy', $webhook->signing_secret); // we want to make sure it's not encrypted.
	}

	/**
	 * This test is important to make sure encrypt/decrypt works as expected.
	 */
	public function test_can_set_and_retrieve_saved_webhook() {
		$data = [
			'id' => 'test',
			'url'            => 'url',
			'webhook_events' => ['test.event'],
			'signing_secret' => 'zMc12r7mGwGYcxa8Wg3i36zy'
		];

		RegisteredWebhook::registration()->save($data);

		$this->assertSame($data, RegisteredWebhook::registration()->get()->toArray());
		$this->assertSame($data['signing_secret'], RegisteredWebhook::getSigningSecret());
	}
}

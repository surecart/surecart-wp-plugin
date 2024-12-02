<?php

namespace SureCart\Tests\Models\RegisteredWebhook;

use SureCart\Models\RegisteredWebhook;
use SureCart\Support\Encryption;
use SureCart\Tests\SureCartUnitTestCase;

class RegisteredWebhookTest extends SureCartUnitTestCase
{
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

		$registered_webhook = RegisteredWebhook::registration()->get()->toArray();
		$this->assertSame($data['webhook_events'], $registered_webhook['webhook_events']);
		$this->assertSame($data['signing_secret'], RegisteredWebhook::getSigningSecret());
	}
}

<?php

namespace SureCart\Webhooks;

use SureCart\Models\Webhook;

/**
 * Handles webhook testings.
 */
class WebhooksTestService {
	/**
	 * Run the queue.
	 *
	 * @return void
	 */
	public function runQueue() {
		add_action( 'surecart/send-test-webhook', [ $this, 'sendTestWebhook' ] );
	}

	/**
	 * Send test webhook to the endpoint from queue.
	 * 
	 * @param string $webhook_id Webhook ID.
	 *
	 * @return void
	 */
	public function sendTestWebhook( string $webhook_id ) {
		Webhook::sendTestWebhook( $webhook_id );
	}
}

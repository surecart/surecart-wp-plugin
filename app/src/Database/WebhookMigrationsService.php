<?php

namespace SureCart\Database;

use SureCart\Models\Webhook;

/**
 * Run this migration when version changes or for new installations.
 */
class WebhookMigrationsService extends GeneralMigration {
	/**
	 * Run the migration.
	 *
	 * @return void
	 */
	public function run() {
		// Get the registered webhooks.
		$webhookEvents = \SureCart::config()->webhook_events;

		// Find the existing registered webhook.
		$webhook = ( new Webhook() )->findExisting();
		if ( ! $webhook ) {
			( new Webhook() )->register();
			$webhook = ( new Webhook() )->findExisting();
		}

		// Update the webhook events on the server.
		$webhook->update(
			[
				'webhook_events' => $webhookEvents,
			]
		);

		// Update the webhook events to webhook history.
		\SureCart::webhooks()->saveRegisteredWebhook( $webhookEvents );
	}
}

<?php

namespace SureCart\Database;

use SureCart\Models\Webhook;
use SureCart\Support\Encryption;

/**
 * Run this migration when version changes or for new installations.
 */
class WebhookMigrationsService extends GeneralMigration {
	/**
	 * The version number when we will run the migration.
	 *
	 * @var string
	 */
	protected $version = '2.1.1';

	/**
	 * Run the migration.
	 *
	 * @return void
	 */
	public function run(): void {
		// Get the registered webhooks.
		$webhookEvents = \SureCart::config()->webhook_events;

		// Get the registered webhooks.
		$registeredWebhook = \SureCart::webhooks()->getRegisteredWebhook();

		// Stop if webhook is not found.
		if ( ! $registeredWebhook ) {
			return;
		}

		// Update the webhook events on the server.
		try {
			$webhook = Webhook::find( $registeredWebhook['id'] );
			$webhook->update(
				[
					'webhook_events' => $webhookEvents,
				]
			);

			// Update the webhooks to webhook history.
			\SureCart::webhooks()->saveRegisteredWebhook(
				[
					'id'  			 => $webhook['id'],
					'url' 			 => $webhook['url'],
					'webhook_events' => $webhook['webhook_events'],
					'signing_secret' => Encryption::encrypt( $webhook['signing_secret'] ),
				]
			);
		} catch ( \Exception $exception ) {
			// Do nothing.
		}
	}
}

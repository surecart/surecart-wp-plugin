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
		$webhook_events = \SureCart::config()->webhook_events;

		// Get the registered webhooks.
		$registered_webhook = \SureCart::webhooks()->getRegisteredWebhook();

		// Stop if webhook is not found.
		if ( ! $registered_webhook ) {
			return;
		}

		// Update the webhook events on the server.
		try {
			$webhook = Webhook::find( $registered_webhook['id'] );

			// Stop if the webhook is not found or there is some error.
			if ( is_wp_error( $webhook ) || empty( $webhook->id ) || empty( $webhook->url ) ) {
				return;
			}

			$webhook->update(
				[
					'webhook_events' => $webhook_events,
				]
			);

			// Update the webhooks to webhook history.
			\SureCart::webhooks()->saveRegisteredWebhook(
				[
					'id'             => $webhook['id'],
					'url'            => $webhook['url'],
					'webhook_events' => $webhook['webhook_events'],
					'signing_secret' => Encryption::encrypt( $webhook['signing_secret'] ),
				]
			);
		} catch ( \Exception $exception ) {
			wp_die( 'Webhook migration fails. Error: ' . esc_attr( $exception->getMessage() ) );
		}
	}
}

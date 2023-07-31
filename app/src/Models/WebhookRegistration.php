<?php

namespace SureCart\Models;

use SureCart\Support\Encryption;

/**
 * Webhook Model.
 */
class WebhookRegistration {
	/**
	 * Registered Webhook option name.
	 *
	 * @var string
	 */
	public const REGISTERED_WEBHOOK_KEY = 'surecart_registered_webhook';

	/**
	 * Save the registered webhook.
	 *
	 * @param array $webhook The webhook to save.
	 *
	 * @return bool
	 */
	public function save( $webhook ): bool {
		return update_option(
			self::REGISTERED_WEBHOOK_KEY,
			[
				'id'             => $webhook['id'],
				'url'            => $webhook['url'],
				'webhook_events' => $webhook['webhook_events'] ?? [],
				'signing_secret' => Encryption::encrypt( $webhook['signing_secret'] ),
			]
		);
	}

	/**
	 * Get registered webhook.
	 *
	 * @return array|null
	 */
	public function get() {
		return new Webhook( get_option( self::REGISTERED_WEBHOOK_KEY, [] ) );
	}

	/**
	 * Delete the registered webhook.
	 *
	 * @return boolean
	 */
	public function delete(): bool {
		return delete_option( self::REGISTERED_WEBHOOK_KEY );
	}
}

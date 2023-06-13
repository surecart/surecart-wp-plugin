<?php

namespace SureCart\Webhooks;

/**
 * Handles accounts changes to webhook
 * Clear the account caches.
 */
class WebhooksAccountService {
	/**
	 * Listen for the event.
	 *
	 * @return void
	 */
	public function listenForAccountUpdated() {
		\add_action( 'surecart/account_updated', [ $this, 'clearAccountCache' ], 10, 2 );
	}

	/**
	 * Clear account cache.
	 *
	 * @return void
	 */
	public function clearAccountCache() {
		delete_transient( 'surecart_account' );
	}
}

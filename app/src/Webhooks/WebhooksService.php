<?php

namespace CheckoutEngine\Webhooks;

use CheckoutEngine\Models\Webhook;
/**
 * WordPress Users service.
 */
class WebhooksService {
	/**
	 * Create webhooks for this site.
	 *
	 * @return void
	 */
	public function maybeCreateWebooks() {
		// we've already registered for this domain, don't register again.
		if ( $this->domainMatches() ) {
			return;
		}

		// register the webhooks.
		$registered = Webhook::register();

		// if successful, update the domain.
		if ( ! empty( $registered->id ) ) {
			$this->setDomain();
		}
	}

	/**
	 * Save the domain for the webhooks
	 *
	 * @return bool
	 */
	protected function setDomain() {
		return update_option( 'ce_webhook_domain', get_site_url() );
	}

	/**
	 * Does the webhook domain match?
	 *
	 * @return boolean
	 */
	protected function domainMatches() {
		return get_site_url() === get_option( 'ce_webhook_domain', '' );
	}
}

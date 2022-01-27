<?php

namespace CheckoutEngine\Webhooks;

use CheckoutEngine\Models\Webhook;
use CheckoutEngine\Support\Encryption;

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
		// TODO: Check for API key and early return if not.
		// if( ! \CheckoutEngine::hasApiKey()) {
		// return false;
		// }

		// skip if we've already registered for this domain and has a signing secret saved.
		if ( $this->domainMatches() && $this->hasSigningSecret() ) {
			return;
		}

		// register the webhooks.
		$registered = Webhook::register();

		// handle error and show notice to user.
		if ( is_wp_error( $registered ) ) {
			add_action( 'admin_notices', [ $this, 'showWebhooksErrorNotice' ] );
			return;
		}

		// if successful, update the domain and signing secret.
		if ( ! empty( $registered->signing_secret ) ) {
			$this->setSigningSecret( $registered->signing_secret );
			$this->setDomain();
		}
	}

	/**
	 * Show a notice if webhook creation failed.
	 *
	 * @param  \WP_Error $error Error object.
	 * @return void
	 */
	public function showWebhooksErrorNotice( \WP_Error $error ) {
		$class   = 'notice notice-error';
		$message = __( 'CheckoutEngine: Webhook could not be created.', 'checkout_engine' ) . ' ' . $error->get_error_message();
		printf( '<div class="%1$s"><p>%2$s</p></div>', esc_attr( $class ), esc_html( $message ) );
	}

	/**
	 * Get the signing secret stored as encrypted data in the WP database.
	 *
	 * @return string|bool Decrypted value, or false on failure.
	 */
	public function getSigningSecret() {
		return Encryption::decrypt( get_option( 'ce_webhook_signing_secret' ) );
	}

	/**
	 * Set the signing secret as encrypted data in the WP database.
	 *
	 * @param string $value The secret.
	 * @return string|bool Encrypted value, or false on failure.
	 */
	public function setSigningSecret( $value ) {
		return Encryption::encrypt( get_option( 'ce_webhook_signing_secret', $value, false ) );
	}

	/**
	 * Does the webhook have a signing secret?
	 *
	 * @return boolean
	 */
	public function hasSigningSecret() {
		return (bool) $this->getSigningSecret();
	}

	/**
	 * Save the domain for the webhooks
	 *
	 * @return bool
	 */
	public function setDomain() {
		return update_option( 'ce_webhook_domain', get_site_url() );
	}

	/**
	 * Does the webhook domain match?
	 *
	 * @return boolean
	 */
	public function domainMatches() {
		return get_site_url() === get_option( 'ce_webhook_domain', '' );
	}
}

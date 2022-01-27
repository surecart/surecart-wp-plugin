<?php

namespace CheckoutEngine\Webhooks;

use CheckoutEngine\Models\Webhook;
use CheckoutEngine\Support\Encryption;

/**
 * WordPress Users service.
 */
class WebhooksService {

	/**
	 * Option value for signing key.
	 *
	 * @var string
	 */
	protected $signing_key = 'ce_webhook_signing_secret';

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
			return add_action(
				'admin_notices',
				function() use ( $registered ) {
					return $this->showWebhooksErrorNotice( $registered );
				}
			);
		}

		// if successful, update the domain and signing secret.
		if ( ! empty( $registered['signing_secret'] ) ) {
			$this->deleteSigningSecret();
			$this->setSigningSecret( $registered['signing_secret'] );
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
		$messages = implode( '<br>', $error->get_error_messages() );
		$class    = 'notice notice-error';
		$message  = __( 'CheckoutEngine webhooks could not be created.', 'checkout_engine' ) . '<br />' . $messages;
		printf( '<div class="%1$s"><p>%2$s</p></div>', esc_attr( $class ), wp_kses_post( $message ) );
	}

	/**
	 * Get the signing secret stored as encrypted data in the WP database.
	 *
	 * @return string|bool Decrypted value, or false on failure.
	 */
	public function getSigningSecret() {
		return Encryption::decrypt( get_option( $this->signing_key, '' ) );
	}

	/**
	 * Set the signing secret as encrypted data in the WP database.
	 *
	 * @param string $value The secret.
	 * @return string|bool Encrypted value, or false on failure.
	 */
	public function setSigningSecret( $value ) {
		return update_option( $this->signing_key, Encryption::encrypt( $value ), false );
	}

	/**
	 * Delete the existing signing secret from the WP database.
	 *
	 * @return bool
	 */
	public function deleteSigningSecret() {
		return delete_option( $this->signing_key );
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

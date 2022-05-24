<?php

namespace SureCart\Webhooks;

use SureCart\Models\ApiToken;
use SureCart\Models\Webhook;
use SureCart\Support\Encryption;

/**
 * WordPress Users service.
 */
class WebhooksService {
	/**
	 * Option value for signing key.
	 *
	 * @var string
	 */
	protected $signing_key = 'sc_webhook_signing_secret';

	/**
	 * Hold the domain service.
	 *
	 * @var \SureCart\Webhooks\WebhooksHistoryService
	 */
	protected $domain_service;

	/**
	 * Get the domain service.
	 *
	 * @param WebhooksHistoryService $domain_service The domain service.
	 */
	public function __construct( WebhooksHistoryService $domain_service ) {
		$this->domain_service = $domain_service;
	}

	/**
	 * Listen for domain changes.
	 *
	 * @return function
	 */
	public function listenForDomainChanges() {
		return $this->domain_service->listen();
	}

	/**
	 * Do we have a token.
	 *
	 * @return boolean
	 */
	public function hasToken() {
		$token = ApiToken::get();
		return ! empty( ApiToken::get() ) && 'test' !== $token;
	}

	/**
	 * Create webhooks for this site.
	 *
	 * @return void
	 */
	public function maybeCreateWebooks() {
		// Check for API key and early return if not.
		if ( ! $this->hasToken() ) {
			return;
		}

		// skip if we've already registered for this domain and has a signing secret saved.
		if ( $this->domainMatches() && $this->hasSigningSecret() ) {
			return;
		}

		// register the webhooks.
		$registered = $this->register();

		// handle error and show notice to user.
		if ( is_wp_error( $registered ) ) {
			return add_action(
				'admin_notices',
				function() use ( $registered ) {
					$this->showWebhooksErrorNotice( $registered );
				}
			);
		}

		// if successful, update the domain and signing secret.
		if ( ! empty( $registered['signing_secret'] ) ) {
			$this->setSigningSecret( $registered['signing_secret'] );
			$this->saveRegisteredWebhook(
				[
					'id'  => $registered['id'],
					'url' => $registered['url'],
				]
			);
			return true;
		}

		return false;
	}

	/**
	 * Register webhooks for this site.
	 *
	 * @return \WP_Error|\SureCart\Models\Webhook;
	 */
	public function register() {
		return Webhook::register();
	}

	/**
	 * Show a notice if webhook creation failed.
	 *
	 * @param  \WP_Error $error Error object.
	 *
	 * @return void
	 */
	public function showWebhooksErrorNotice( \WP_Error $error ) {
		$messages = implode( '<br>', $error->get_error_messages() );
		$class    = 'notice notice-error';
		$message  = __( 'SureCart webhooks could not be created.', 'surecart' ) . $messages;
		printf( '<div class ="%1$s"><p>%2$s</p></div>', esc_attr( $class ), wp_kses_post( $message ) );
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
		$this->deleteSigningSecret();
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
	public function saveRegisteredWebhook( $webhook ) {
		return $this->domain_service->saveRegisteredWebhook( $webhook );
	}

	/**
	 * Does the webhook domain match?
	 *
	 * @return boolean
	 */
	public function domainMatches() {
		return $this->domain_service->domainMatches();
	}

	/**
	 * Broadcast the php hook.
	 * This sets the webhook in a transient so that
	 * it is not accidentally broadcasted twice.
	 *
	 * @return void
	 */
	public function broadcast( $event, $model ) {
		$webhook = get_transient( 'surecart_webhook_' . $event . $model->id, false );
		if ( false === $webhook ) {
			// perform the action.
			do_action( $event, $model );
			set_transient( 'surecart_webhook_' . $event . $model->id, true, HOUR_IN_SECONDS );
		}
	}
}

<?php

namespace SureCart\Webhooks;

use SureCart\Models\ApiToken;
use SureCart\Models\Webhook;
use SureCart\Support\Encryption;

/**
 * Webhooks service.
 */
class WebhooksService {
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
	public function hasToken(): bool {
		$token = ApiToken::get();
		return ! empty( ApiToken::get() ) && 'test' !== $token;
	}

	/**
	 * May be create webhook.
	 * 
	 * Check if we have previous webhook registered for this site 
	 * but for staging or something else.
	 *
	 * @return void
	 */
	public function maybeCreateWebhook(): void {
		// Get registered webhooks.
		$registeredWebhooks = $this->domain_service->getRegisteredWebhooks() ?? [];

		// If there is a registered webhook, and the domain matched, then return.
		$matched = false;
		foreach ( $registeredWebhooks as $registeredWebhook ) {
			if ( $this->domain_service->getDomain( $registeredWebhook['url'] ) === $this->domain_service->getDomain( Webhook::getListenerUrl() ) ) {
				$matched = true;
			}
		}

		if ( $matched ) {
			return;
		}

		$this->createWebhook();
	}

	/**
	 * Create webhooks for this site.
	 *
	 * @return void
	 */
	public function createWebhook(): void {
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
			add_action(
				'admin_notices',
				function() use ( $registered ) {
					$this->showWebhooksErrorNotice( $registered );
				}
			);
		}

		// if successful, update the domain and signing secret.
		if ( ! empty( $registered['signing_secret'] ) ) {
			// $this->setSigningSecret( $registered['signing_secret'] );
			$this->saveRegisteredWebhook(
				[
					'id'  		     => $registered['id'],
					'url' 			 => $registered['url'],
					'webhook_events' => $registered['webhook_events'],
					'signing_secret' => Encryption::encrypt( $registered['signing_secret'] ),
				]
			);
		}
	}

	/**
	 * Delete the registered webhook.
	 *
	 * @return void
	 */
	public function maybeClearWebhook(): void {
		$webhook = Webhook::findExisting();
		if ( $webhook ) {
			Webhook::delete( $webhook['id'] );

			// Delete this webhook from registered webhooks list.
			$this->domain_service->deleteRegisteredWebhookById( $webhook['id'] );
		}
	}

	/**
	 * Register webhooks for this site.
	 *
	 * @return \WP_Error|\SureCart\Models\Webhook
	 */
	public function register() {
		if ( defined( 'SURECART_RUNNING_TESTS' ) ) {
			return;
		}
		return Webhook::register();
	}

	/**
	 * Show a notice if webhook creation failed.
	 *
	 * @param  \WP_Error $error Error object.
	 *
	 * @return void
	 */
	public function showWebhooksErrorNotice( \WP_Error $error ): void {
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
		// Get the registered webhook.
		$webhook = $this->domain_service->getRegisteredWebhook();

		// Return the signing secret from the registered webhook.
		return Encryption::decrypt( $webhook['signing_secret'] ?? '' );
	}

	/**
	 * Does the webhook have a signing secret?
	 *
	 * @return boolean
	 */
	public function hasSigningSecret(): bool {
		return (bool) $this->getSigningSecret();
	}

	/**
	 * Save the webhook data to registered webhooks.
	 *
	 * @param array $webhook
	 * @return bool
	 */
	public function saveRegisteredWebhook( array $webhook ): bool {
		return $this->domain_service->saveRegisteredWebhook( $webhook );
	}

	/**
	 * Get the registered webhook.
	 *
	 * @return array|null
	 */
	public function getRegisteredWebhook() {
		return $this->domain_service->getRegisteredWebhook();
	}

	/**
	 * Get previous webhook.
	 *
	 * @return array|null
	 */
	public function getPreviousWebhook() {
		return $this->domain_service->getPreviousWebhook();
	}

	/**
	 * Get the registered webhooks.
	 *
	 * @return array
	 */
	public function getRegisteredWebhooks(): array {
		return $this->domain_service->getRegisteredWebhooks();
	}

	/**
	 * Delete registered webhook by id.
	 *
	 * @param string $webhookId
	 *
	 * @return bool
	 */
	public function deleteRegisteredWebhookById( string $webhookId ): bool {
		return $this->domain_service->deleteRegisteredWebhookById( $webhookId );
	}

	/**
	 * Does the webhook domain match?
	 *
	 * @return boolean
	 */
	public function domainMatches(): bool {
		return $this->domain_service->domainMatches();
	}

	/**
	 * Broadcast the php hook.
	 * This sets the webhook in a transient so that
	 * it is not accidentally broadcasted twice.
	 *
	 * @return void
	 */
	public function broadcast( $event, $model ): void {
		$webhook = get_transient( 'surecart_webhook_' . $event . $model->id, false );
		if ( false === $webhook ) {
			// perform the action.
			do_action( $event, $model );
			set_transient( 'surecart_webhook_' . $event . $model->id, true, HOUR_IN_SECONDS );
		}
	}
}

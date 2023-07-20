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
	 * May be Create webhooks for this site.
	 *
	 * @return void
	 */
	public function maybeCreateWebhooks(): void {
		// Check for API key and early return if not.
		if ( ! $this->hasToken() ) {
			return;
		}

		// skip if we've already registered for this domain and has a signing secret saved.
		if ( $this->domainMatches() && $this->hasSigningSecret() ) {
			return;
		} elseif ( ! empty( $this->getRegisteredWebhook()['id'] ) ) {
			// if domain does not match and we have already a registered webhook, then return.
			// we would show the notice instead of automatically register a new webhook.
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

		// if successful, update webhook data.
		if ( ! empty( $registered['signing_secret'] ) ) {
			$this->saveRegisteredWebhook(
				[
					'id'             => $registered['id'],
					'url'            => $registered['url'],
					'webhook_events' => $registered['webhook_events'] ?? [],
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
		$webhook = $this->getRegisteredWebhook();

		if ( $webhook && ! empty( $webhook['id'] ) ) {
			Webhook::delete( $webhook['id'] );

			// Delete the registered webhook.
			$this->domain_service->deleteRegisteredWebhook();
		}
	}

	/**
	 * Verify webhooks.
	 *
	 * @return void
	 */
	public function verifyWebhooks(): void {
		$has_webhook_error = Webhook::hasAnyWebhookError();

		// If there is no webhook, then show error notice.
		if ( $has_webhook_error ) {
			add_action(
				'admin_notices',
				function() {
					$this->showWebhooksErrorNotice( new \WP_Error( 'webhook_error', __( 'Connection is not working.', 'surecart' ) ) );
				}
			);
			return;
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
	 * Show a notice if webhook creation failed or if connection is not working.
	 *
	 * @param  \WP_Error $error Error object.
	 *
	 * @return void
	 */
	public function showWebhooksErrorNotice( \WP_Error $error ): void {
		$messages = implode( '<br>', $error->get_error_messages() );
		$class    = 'notice notice-error';
		$message  = __( 'SureCart site connection error.', 'surecart' ) . $messages;
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
	 * @param array $webhook Webhook data.
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
	 * Delete the previous webhook.
	 *
	 * @return boolean
	 */
	public function deletePreviousWebhook(): bool {
		return $this->domain_service->deletePreviousWebhook();
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
	 * @param string $event Event name.
	 * @param mixed  $model Model.
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

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
	 * Bootstrap the integration.
	 *
	 * @return void
	 */
	public function bootstrap() {
		\add_action( 'admin_init', [ $this, 'verifyWebhooks' ] );
		\add_action( 'surecart/account_updated', [ $this, 'clearAccountCache' ], 10, 2 );
	}

	/**
	 * Clear account transient cache.
	 *
	 * @return void
	 */
	public function clearAccountCache() {
		delete_transient( 'surecart_account' );
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
	 * @return function
	 */
	public function verifyWebhooks() {
		$webhook = Webhook::current();

		if ( is_wp_error( $webhook ) ) {
			// not created, this is recreated elsewhere, so let's ignore it.
			if ( 'webhook_endpoint.not_found' === $webhook->get_error_code() ) {
				return;
			}
			// handle other errors.
			return \SureCart::notices()->add(
				[
					'name'  => 'webhooks_general_error',
					'type'  => 'error',
					'title' => esc_html__( 'SureCart Webhooks Error', 'surecart' ),
					'text'  => $webhook->get_error_message(),
				]
			);
		}

		// If webhook is not created, show notice.
		// This should not happen, but just in case.
		if ( ! $webhook || empty( $webhook['id'] ) ) {
			return \SureCart::notices()->add(
				[
					'name'  => 'webhooks_not_created',
					'type'  => 'error',
					'title' => esc_html__( 'SureCart Webhooks Error', 'surecart' ),
					'text'  => esc_html__( 'Webhooks cannot be created.', 'surecart' ),
				]
			);
		}

		// Show the grace period notice.
		if ( ! empty( $webhook->erroring_grace_period_ends_at ) ) {
			$message = $webhook->erroring_grace_period_ends_at > time() ? sprintf( esc_html__( 'Your SureCart connection is experiencing errors. We will disable the integrations connection in %s.', 'surecart' ), human_time_diff( $webhook->erroring_grace_period_ends_at ) ) : sprintf( esc_html__( 'Your SureCart connection is experiencing errors. It was automatically disabled %s ago.', 'surecart' ), human_time_diff( $webhook->erroring_grace_period_ends_at ) );
			return \SureCart::notices()->add(
				[
					'name'  => 'webhooks_erroring_grace_period_' . $webhook->erroring_grace_period_ends_at,
					'type'  => 'warning',
					'title' => esc_html__( 'SureCart Webhook Connection', 'surecart' ),
					'text'  => $message . '<p><a href="#" class="button">Troubleshoot Connection</a></p>',
				]
			);
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

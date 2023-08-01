<?php

namespace SureCart\Webhooks;

use SureCart\Models\ApiToken;
use SureCart\Models\RegisteredWebhook;
use SureCart\Support\Encryption;
use SureCart\Support\Server;
use SureCart\Support\URL;

/**
 * Webhooks service.
 */
class WebhooksService {
	/**
	 * Bootstrap the integration.
	 *
	 * @return void
	 */
	public function bootstrap() {
		// we can skip this for localhost.
		if ( apply_filters( 'surecart/webhooks/localhost/register', $this->isLocalHost() ) ) {
			return;
		}
		// maybe create webhooks if they are not yet created.
		\add_action( 'admin_init', [ $this, 'maybeCreate' ] );
		// verify existing webhooks are functioning properly.
		\add_action( 'admin_init', [ $this, 'verify' ] );
		// listen for any domain changes and show notice.
		\add_action( 'admin_notices', [ $this, 'maybeShowDomainChangeNotice' ] );
	}

	/**
	 * Maybe show a notice to the user that the domain has changed.
	 *
	 * This will prompt them to take action to either update the webhook or create a new webhook.
	 *
	 * @return string|null
	 */
	public function maybeShowDomainChangeNotice() {
		$webhook = RegisteredWebhook::get();

		// let's handle the error elsewhere.
		if ( is_wp_error( $webhook ) || empty( $webhook['id'] ) || empty( $webhook['url'] ) ) {
			return;
		}

		// the domain matches, so everything is good.
		if ( RegisteredWebhook::currentDomainMatches() ) {
			return;
		}

		// if domain does not match, then show notice.
		wp_enqueue_style( 'surecart-webhook-admin-notices' );
		return \SureCart::render(
			'admin/notices/webhook-change',
			[
				'previous_webhook' => $webhook,
				'update_url'       => \SureCart::getUrl()->editModel( 'update_webhook', $webhook['id'] ),
				'add_url'          => \SureCart::getUrl()->editModel( 'create_webhook', '0' ),
				'previous_web_url' => URL::getSchemeAndHttpHost( $webhook['url'] ),
				'current_web_url'  => URL::getSchemeAndHttpHost( RegisteredWebhook::getListenerUrl() ),
			]
		);
	}

	/**
	 * Do we have a token.
	 *
	 * @return boolean
	 */
	public function hasToken(): bool {
		return ! empty( ApiToken::get() );
	}

	/**
	 * May be Create webhooks for this site.
	 *
	 * @return void
	 */
	public function maybeCreate(): void {
		// Check for API key and early return if not.
		if ( ! $this->hasToken() ) {
			return;
		}

		// get the saved webhook.
		$registered = RegisteredWebhook::registration()->get();

		// We have one registered already.
		if ( ! empty( $registered->id ) ) {
			return;
		}

		// register the webhooks.
		$registered = RegisteredWebhook::create();

		// handle error and show notice to user.
		if ( is_wp_error( $registered ) ) {
			\SureCart::notices()->add(
				[
					'name'  => 'webhooks_registration_error',
					'type'  => 'warning',
					'title' => esc_html__( 'SureCart Webhook Registration Error', 'surecart' ),
					'text'  => sprintf( '<p>%s</p>', ( implode( '<br />', $registered->get_error_messages() ?? [] ) ) ),
				]
			);
		}

		// send a test.
		$registered->test();
	}

	/**
	 * Is this localhost?
	 *
	 * @return boolean
	 */
	public function isLocalHost() {
		return ( new Server( RegisteredWebhook::getListenerUrl() ) )->isLocalHost();
	}

	/**
	 * Verify webhooks.
	 *
	 * @return function
	 */
	public function verify() {
		$webhook = RegisteredWebhook::get();

		if ( is_wp_error( $webhook ) ) {
			// not found, let's recreate one.
			if ( 'webhook_endpoint.not_found' === $webhook->get_error_code() ) {
				// delete saved.
				RegisteredWebhook::registration()->delete();
				// create.
				return $this->maybeCreate();
			}

			// handle other errors.
			return \SureCart::notices()->add(
				[
					'name'  => 'webhooks_general_error',
					'type'  => 'error',
					'title' => esc_html__( 'SureCart Webhooks Error', 'surecart' ),
					'text'  => sprintf( '<p>%s</p>', ( implode( '<br />', $webhook->get_error_messages() ?? [] ) ) ),
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
					'text'  => '<p>' . esc_html__( 'Webhooks cannot be created.', 'surecart' ) . '</p>',
				]
			);
		}

		// Show the grace period notice.
		if ( ! empty( $webhook->erroring_grace_period_ends_at ) ) {
			$message   = [];
			$message[] = $webhook->erroring_grace_period_ends_at > time() ? esc_html__( 'Your SureCart webhook connection is being monitored due to errors. This can cause issues with any of your SureCart integrations.', 'surecart' ) : esc_html__( 'Your SureCart webhook connection was disabled due to repeated errors. This can cause issues with any of your SureCart integrations.', 'surecart' );
			$message[] = $webhook->erroring_grace_period_ends_at > time() ? sprintf( wp_kses( 'These errors will automatically attempt to be retried, however, we will disable this in <strong>%s</strong> if it continues to fail.', 'surecart' ), human_time_diff( $webhook->erroring_grace_period_ends_at ) ) : sprintf( wp_kses( 'It was automatically disabled %s ago.', 'surecart' ), human_time_diff( $webhook->erroring_grace_period_ends_at ) );
			$message[] = __( 'If you have already fixed this you can dismiss this notice.', 'surecart' );
			$message[] = '<p><a href="https://app.surecart.com/developer" class="button" target="_blank">' . esc_html__( 'Troubleshoot Connection', 'surecart' ) . '</a></p>';

			return \SureCart::notices()->add(
				[
					'name'  => 'webhooks_erroring_grace_period_' . $webhook->erroring_grace_period_ends_at,
					'type'  => 'warning',
					'title' => esc_html__( 'SureCart Webhook Connection', 'surecart' ),
					'text'  => sprintf( '<p>%s</p>', ( implode( '<br />', $message ) ) ),
				]
			);
		}
	}

	/**
	 * Get the signing secret stored as encrypted data in the WP database.
	 *
	 * @return string|bool Decrypted value, or false on failure.
	 */
	public function getSigningSecret() {
		// Get the registered webhook.
		$webhook = RegisteredWebhook::get();
		// Return the signing secret from the registered webhook.
		return Encryption::decrypt( $webhook['signing_secret'] ?? '' );
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

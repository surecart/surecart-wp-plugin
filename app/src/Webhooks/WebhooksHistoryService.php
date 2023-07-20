<?php

namespace SureCart\Webhooks;

use SureCart\Models\Webhook;

/**
 * Handles domain name changes to webhook
 * Shows notices and allows user to remove old webhooks.
 */
class WebhooksHistoryService {
	/**
	 * Webhooks service.
	 *
	 * @var \SureCart\Webhooks\WebhooksService
	 */
	protected $webhooks_service;

	/**
	 * Registered Webhook option name.
	 *
	 * @var string
	 */
	public const REGISTERED_WEBHOOK = 'surecart_registered_webhook';

	/**
	 * Previous Webhook option name.
	 *
	 * @var string
	 */
	public const PREVIOUS_WEBHOOK = 'surecart_previous_webhook';

	/**
	 * Listen to domain changes.
	 *
	 * @return void
	 */
	public function listen(): void {
		add_action( 'updated_option', [ $this, 'maybeStoreWebhookChange' ], 10, 3 );
		add_action( 'admin_notices', [ $this, 'maybeShowDomainChangeNotice' ] );
	}

	/**
	 * See if the domain changes, then
	 * store the change in the database.
	 *
	 * @param string $option    Name of the updated option.
	 * @param mixed  $old_value The old option value.
	 * @param mixed  $value     The new option value.
	 * @return void
	 */
	public function maybeStoreWebhookChange( $option, $old_value, $value ) {
		// we only care about our option and if it was updated.
		if ( self::REGISTERED_WEBHOOK !== $option ) {
			return;
		}

		// store the old webhook when this changes.
		$this->setPreviousWebhook( $old_value );
	}

	/**
	 * Save the registered webhook.
	 *
	 * @param array $webhook The webhook to save.
	 *
	 * @return bool
	 */
	public function saveRegisteredWebhook( $webhook ): bool {
		return update_option( self::REGISTERED_WEBHOOK, $webhook );
	}

	/**
	 * Get registered webhook.
	 *
	 * @return array|null
	 */
	public function getRegisteredWebhook() {
		return get_option( self::REGISTERED_WEBHOOK, [] );
	}

	/**
	 * Delete the registered webhook.
	 *
	 * @return boolean
	 */
	public function deleteRegisteredWebhook(): bool {
		return delete_option( self::REGISTERED_WEBHOOK );
	}

	/**
	 * Store the old domain in the database.
	 * We do autoload this option so we can check it on every request.
	 *
	 * @param string $value The old domain.
	 * @return boolean
	 */
	public function setPreviousWebhook( $value ) {
		return update_option( self::PREVIOUS_WEBHOOK, $value );
	}

	/**
	 * Delete any previous webhooks.
	 *
	 * @return boolean
	 */
	public function deletePreviousWebhook(): bool {
		return delete_option( self::PREVIOUS_WEBHOOK );
	}

	/**
	 * Get the previous webhook.
	 *
	 * @return array|null
	 */
	public function getPreviousWebhook() {
		return get_option( self::PREVIOUS_WEBHOOK, [] );
	}

	/**
	 * Does this webhook have multiple domains registered?
	 *
	 * @return boolean
	 */
	public function getPreviousDomain() {
		$webhook = $this->getPreviousWebhook();
		return $webhook['url'] ?? '';
	}

	/**
	 * Does the webhook domain match?
	 *
	 * @return boolean
	 */
	public function domainMatches(): bool {
		$webhook = $this->getRegisteredWebhook();
		if ( empty( $webhook['url'] ) ) {
			return false;
		}

		return Webhook::getListenerUrl() === $webhook['url'];
	}

	/**
	 * May be show a notice to the user that the domain has changed.
	 *
	 * @return string|null
	 */
	public function maybeShowDomainChangeNotice() {
		// skip if we've already registered for this domain.
		if ( $this->domainMatches() ) {
			return;
		}

		$webhook = $this->getRegisteredWebhook();

		if ( empty( $webhook['id'] ) || empty( $webhook['url'] ) ) {
			return;
		}

		// if domain does not match, then show notice.
		return $this->renderNotice( $webhook );
	}

	/**
	 * Render the notice.
	 *
	 * @param array $webhook The webhook.
	 *
	 * @return string|null
	 */
	public function renderNotice( array $webhook ) {
		wp_enqueue_style( 'surecart-webhook-admin-notices' );

		return \SureCart::render(
			'admin/notices/webhook-change',
			[
				'previous_webhook' => $webhook,
				'update_url'       => \SureCart::getUrl()->editModel( 'update_webhook', $webhook['id'] ),
				'add_url'          => \SureCart::getUrl()->editModel( 'create_webhook', '0' ),
				'previous_web_url' => $this->getWebsiteUrl( $webhook['url'] ),
				'current_web_url'  => $this->getWebsiteUrl( Webhook::getListenerUrl() ),
			]
		);
	}

	/**
	 * Get the website url from the webhook endpoint.
	 *
	 * @param string $webhook_endpoint The webhook endpoint.
	 *
	 * @return string
	 */
	public function getWebsiteUrl( string $webhook_endpoint ): string {
		if ( empty( $webhook_endpoint ) ) {
			return '';
		}

		$parsed_url = parse_url( $webhook_endpoint );

		if ( empty( $parsed_url['scheme'] ) || empty( $parsed_url['host'] ) ) {
			return '';
		}

		return $parsed_url['scheme'] . '://' . $parsed_url['host'];
	}
}

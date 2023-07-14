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
	 * Get all registered webhooks option name.
	 *
	 * @var string
	 */
	public const WEBHOOK_REGISTERED_ENTRIES = 'surecart_registered_webhooks';

	/**
	 * Listen to domain changes.
	 *
	 * @return void
	 */
	public function listen(): void {
		add_action( 'admin_notices', [ $this, 'maybeShowDomainChangeNotice' ] );
	}

	/**
	 * Save the registered webhook.
	 *
	 * Push the webhook to the registered webhooks list.
	 *
	 * @param array $webhook The webhook to save.
	 *
	 * @return bool
	 */
	public function saveRegisteredWebhook( array $webhook ): bool {
		$registered_webhooks = $this->getRegisteredWebhooks() ?? [];

		// If there is already a webhook for this site, remove it.
		$registered_webhooks = array_filter(
			$registered_webhooks,
			function( $registered_webhook ) use ( $webhook ) {
				return $registered_webhook['url'] !== $webhook['url'];
			}
		);

		// Merge the new webhook with the previous webhooks.
		$webhooks = array_merge( $registered_webhooks, [ $webhook ] );

		// Save the webhooks.
		return $this->saveRegisteredWebhooks( $webhooks );
	}

	/**
	 * Get registered webhook.
	 *
	 * Filter the registered webhooks to get the webhook for this site.
	 *
	 * @return array|null
	 */
	public function getRegisteredWebhook() {
		$registered_webhooks = $this->getRegisteredWebhooks() ?? [];

		// If no items, return null.
		if ( empty( $registered_webhooks ) || ! is_array( $registered_webhooks ) ) {
			return null;
		}

		// Get the registered webhook for this site.
		$webhooks = array_filter(
			$registered_webhooks,
			function( $webhook ) {
				return Webhook::getListenerUrl() === $webhook['url'];
			}
		);

		// Return the first webhook.
		return array_shift( $webhooks );
	}

	/**
	 * Get previous webhook.
	 *
	 * @return array|null
	 */
	public function getPreviousWebhook() {
		$registered_webhooks = $this->getRegisteredWebhooks() ?? [];

		// If no items, return null.
		if ( empty( $registered_webhooks ) || ! is_array( $registered_webhooks ) ) {
			return null;
		}

		$webhooks = array_filter(
			$registered_webhooks,
			function( $webhook ) {
				$current_domain = $this->getDomain( Webhook::getListenerUrl() );
				$webhook_domain = $this->getDomain( $webhook['url'] );
				return Webhook::getListenerUrl() !== $webhook['url'] && $current_domain === $webhook_domain;
			}
		);

		return array_shift( $webhooks );
	}

	/**
	 * Get registered webhooks.
	 *
	 * @return array
	 */
	public function getRegisteredWebhooks(): array {
		return get_option( self::WEBHOOK_REGISTERED_ENTRIES, [] );
	}

	/**
	 * Save the registered webhooks.
	 *
	 * @param array $webhooks The list of webhooks to save.
	 *
	 * @return bool
	 */
	public function saveRegisteredWebhooks( $webhooks ): bool {
		return update_option( self::WEBHOOK_REGISTERED_ENTRIES, $webhooks );
	}

	/**
	 * Delete registered webhook by id.
	 *
	 * @param string $webhook_id The webhook id to delete.
	 *
	 * @return bool
	 */
	public function deleteRegisteredWebhookById( string $webhook_id ): bool {
		$registered_webhooks = $this->getRegisteredWebhooks() ?? [];

		if ( ! empty( $registered_webhooks ) ) {
			foreach ( $registered_webhooks as $key => $registered_webhook ) {
				if ( $registered_webhook['id'] === $webhook_id ) {
					unset( $registered_webhooks[ $key ] );
				}
			}
		}

		// After unsetting, save the registered webhooks.
		return $this->saveRegisteredWebhooks( $registered_webhooks );
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
	 * @return void
	 */
	public function maybeShowDomainChangeNotice(): void {
		// Retreive the saved registered webhook.
		$webhook = $this->getRegisteredWebhook();

		// If we found a registered webhook for this site, then return.
		if ( ! empty( $webhook ) && Webhook::getListenerUrl() === $webhook['url'] ) {
			return;
		}

		// If no previous webhook, means - user somehow deleted all.
		$previous_webhook = $this->getPreviousWebhook();
		if ( empty( $previous_webhook ) ) {
			$this->renderNotice( [], false );
			return;
		}

		// Abstract the domain name from previous webhook and compare with current domain.
		$is_duplicate = $this->getDomain( $previous_webhook['url'] ) === $this->getDomain( Webhook::getListenerUrl() );

		// Render the notice.
		$this->renderNotice( $previous_webhook, $is_duplicate );
	}

	/**
	 * Get the domain name from the url.
	 *
	 * @param string $url The url to get the domain from.
	 *
	 * @return string|null
	 */
	public function getDomain( string $url ) {
		return wp_parse_url( $url, PHP_URL_HOST );
	}

	/**
	 * Render the notice.
	 *
	 * @param array   $previous_webhook The previous webhook.
	 * @param boolean $is_duplicate     Is the domain duplicate.
	 *
	 * @return void
	 */
	private function renderNotice( array $previous_webhook, bool $is_duplicate = false ): void {
		wp_enqueue_style( 'surecart-webhook-admin-notices' );

		echo \SureCart::render(
			'admin/notices/webhook-change',
			[
				'previous_webhook' => $previous_webhook,
				'update_url'       => \SureCart::getUrl()->editModel( 'update_webhook', $previous_webhook['id'] ),
				'add_url'          => \SureCart::getUrl()->editModel( 'create_webhook', '0' ),
				'is_duplicate'     => $is_duplicate,
				'previous_web_url' => $this->getWebsiteUrl( $previous_webhook['url'] ?? '' ),
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
	private function getWebsiteUrl( string $webhook_endpoint ): string {
		$parsed_url = parse_url( $webhook_endpoint );
		return $parsed_url['scheme'] . '://' . $parsed_url['host'];
	}
}

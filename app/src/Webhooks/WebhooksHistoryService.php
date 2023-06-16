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
	public const WEBHOOK_REGISTERED_ENTRIES = 'ce_registered_webhooks';

	/**
	 * Webhook ignore notice option name.
	 *
	 * @var string
	 */
	public const WEBHOOK_IGNORE_NOTICE_KEY = 'ce_ignore_webhook_notice';

	/**
	 * Listen to domain changes.
	 *
	 * @return void
	 */
	public function listen(): void {
		\add_action( 'admin_notices', [ $this, 'maybeShowDomainChangeNotice' ] );
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
		$registeredWebhooks = $this->getRegisteredWebhooks() ?? [];

		// If there is already a webhook for this site, remove it.
		$registeredWebhooks = array_filter( $registeredWebhooks, function( $registeredWebhook ) use ( $webhook ) {
			return $registeredWebhook['url'] !== $webhook['url'];
		} );

		// Merge the new webhook with the previous webhooks.
		$webhooks = array_merge( $registeredWebhooks, [ $webhook ] );

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
		$registeredWebhooks = $this->getRegisteredWebhooks() ?? [];

		// If no items, return null.
		if ( empty( $registeredWebhooks ) || ! is_array( $registeredWebhooks ) ) {
			return null;
		}
		
		// Get the registered webhook for this site.
		$filteredWebhooks = array_filter( $registeredWebhooks, function( $webhook ) {
			return $webhook['url'] === Webhook::getListenerUrl();
		} );

		// Return the first webhook.
		return array_shift( $filteredWebhooks );
	}

	/**
	 * Get previous webhook.
	 *
	 * @return array|null
	 */
	public function getPreviousWebhook() {
		$registeredWebhooks = $this->getRegisteredWebhooks() ?? [];

		// If no items, return null.
		if ( empty( $registeredWebhooks ) || ! is_array( $registeredWebhooks ) ) {
			return null;
		}

		$filteredWebhooks = array_filter( $registeredWebhooks, function( $webhook ) {
			$currentDomain = $this->getDomain( Webhook::getListenerUrl() );
			$webhookDomain = $this->getDomain( $webhook['url'] );
			return $webhook['url'] !== Webhook::getListenerUrl()
				&& $currentDomain === $webhookDomain;
		} );

		return array_shift( $filteredWebhooks );
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
	 * @return bool
	 */
	public function saveRegisteredWebhooks( $webhooks ): bool {
		return update_option( self::WEBHOOK_REGISTERED_ENTRIES, $webhooks );
	}

	/**
	 * Get if the user has ignored the notice forcefully.
	 *
	 * @return bool
	 */
	public function getIgnoreNotice(): bool {
		return get_option( self::WEBHOOK_IGNORE_NOTICE_KEY, false );
	}

	/**
	 * Set if the user has ignored the notice.
	 *
	 * @param bool $value
	 *
	 * @return void
	 */
	public function setIgnoreNotice( $value ): void {
		update_option( self::WEBHOOK_IGNORE_NOTICE_KEY, $value );
	}

	/**
	 * Delete registered webhook by id.
	 *
	 * @param string $webhookId
	 *
	 * @return bool
	 */
	public function deleteRegisteredWebhookById( string $webhookId ): bool {
		$registeredWebhooks = $this->getRegisteredWebhooks() ?? [];

		if ( ! empty( $registeredWebhooks ) ) {
			foreach ( $registeredWebhooks as $key => $registeredWebhook ) {
				if ( $registeredWebhook['id'] === $webhookId ) {
					unset( $registeredWebhooks[ $key ] );
				}
			}
		}

		// After unsetting, save the registered webhooks.
		return $this->saveRegisteredWebhooks( $registeredWebhooks );
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
		// Stop if the user has ignored the notice once.
		if ( $this->getIgnoreNotice() ) {
			return;
		}

		// Retreive the saved registered webhook.
		$webhook = $this->getRegisteredWebhook();

		// If we found a registered webhook for this domain, then return.
		if ( ! empty( $webhook ) && $webhook['url'] === Webhook::getListenerUrl() ) {
			return;
		}

		// If no previous webhook, means - user somehow deleted all.
		$previousWebhook = $this->getPreviousWebhook();
		if ( empty( $previousWebhook ) ) {
			$this->renderNotice( [], false );
			return;
		}

		// Abstract the domain name from previous webhook and compare with current domain.
		$isDuplicate = $this->getDomain( $previousWebhook['url'] ) === $this->getDomain( Webhook::getListenerUrl() );

		// Render the notice.
		$this->renderNotice( $previousWebhook, $isDuplicate );
	}

	/**
	 * Get the domain name from the url.
	 *
	 * @param string $url
	 *
	 * @return string|null
	 */
	public function getDomain( string $url ) {
		return parse_url( $url, PHP_URL_HOST );
	}

	/**
	 * Render the notice.
	 *
	 * @param array $previousWebhook
	 * @param boolean $isDuplicate
	 *
	 * @return void
	 */
	private function renderNotice( array $previousWebhook, bool $isDuplicate = false ): void {
		?>
		<div class="notice notice-error">
			<p>
			<?php
				if ( $isDuplicate ) {
					_e( 'It looks like this site has been duplicated or a staging site. You should create new webhook for the domain to prevent purchase sync issues.', 'surecart' );
				} else {
					_e( 'It looks like this site has been moved to a different address. You should create new webhook for the domain to prevent purchase sync issues.', 'surecart' );
				}
			?>
			</p>
			<p>
			<?php
				echo $isDuplicate ? $this->actionIgnoreWebhook() : '';

				if ( empty( $previousWebhook ) ) {
					echo $this->actionAddWebhook();
				} else {
					echo $this->actionAddWebhook();
					echo $this->actionUpdateWebhook( $previousWebhook );
					echo $this->actionRemoveWebhook( $previousWebhook );
				}
			?>
			</p>
		</div>
		<?php
	}

	/**
	 * Ignore webhook action link and text.
	 *
	 * @return string
	 */
	private function actionIgnoreWebhook(): string {
		return sprintf(
			'<a href="%1s" class="button button-primary" style="margin-right: 10px;" aria-label="%2s">%3s</a>',
			esc_url( \SureCart::getUrl()->editModel( "ignore_webhook", '0' ) ),
			esc_attr__( 'Ignore Webhook', 'surecart' ),
			esc_html__( 'Ignore Webhook', 'surecart' )
		);
	}

	/**
	 * Add webhook action link and text.
	 *
	 * @return string
	 */
	private function actionAddWebhook(): string {
		return sprintf(
			'<a href="%1s" class="button button-primary" style="margin-right: 10px;" aria-label="%2s">%3s</a>',
			esc_url( \SureCart::getUrl()->editModel( 'create_webhook', '0' ) ),
			esc_attr__( 'Create New Webhook', 'surecart' ),
			esc_html__( 'Create New Webhook', 'surecart' )
		);
	}

	/**
	 * Update webhook action link and text.
	 *
	 * @param array $webhook
	 * @return string
	 */
	private function actionUpdateWebhook( array $webhook ): string {
		return sprintf(
			'<a href="%1s" class="button button-primary" style="margin-right: 10px;" aria-label="%2s">%3s</a>',
			esc_url( \SureCart::getUrl()->editModel( "update_webhook", $webhook['id'] ) ),
			esc_attr__( 'Update Webhook.', 'surecart' ),
			esc_html__( 'Update Webhook', 'surecart' )
		);
	}

	/**
	 * Remove webhook action link and text.
	 *
	 * @param array $webhook
	 * @return string
	 */
	private function actionRemoveWebhook( array $webhook ): string {
		$confirm_message = __( 'Are you sure you want to remove the previous webhook?', 'surecart' );
		$link            = \SureCart::getUrl()->editModel( "remove_webhook", $webhook['id'] );
		$text            = __( 'Remove Previous Webhook', 'surecart' );

		return sprintf(
			'<a class="button button-confirm" style="margin-right: 10px;" onclick="return confirm(\'%1s\')" href="%2s" aria-label="%3s">%4s</a>',
			esc_attr( $confirm_message ),
			esc_url( $link ),
			esc_attr__( 'Remove Previous Webhook', 'surecart' ),
			esc_html( $text )
		);
	}
}

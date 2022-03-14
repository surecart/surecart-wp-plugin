<?php

namespace CheckoutEngine\Webhooks;

use CheckoutEngine\Models\Webhook;

/**
 * Handles domain name changes to webhook
 * Shows notices and allows user to remove old webhooks.
 */
class WebHooksHistoryService {
	/**
	 * Webhooks service.
	 *
	 * @var \CheckoutEngine\Webhooks\WebhooksService
	 */
	protected $webhooks_service;

	/**
	 * The option name.
	 *
	 * @var string
	 */
	protected $registered_webhook = 'ce_registered_webhook';

	/**
	 * The old domains option name.
	 *
	 * @var string
	 */
	protected $previous_webhook = 'ce_previous_webhook';

	/**
	 * Listen to domain changes.
	 *
	 * @return void
	 */
	public function listen() {
		\add_action( 'updated_option', [ $this, 'maybeStoreWebhookChange' ], 10, 3 );
		\add_action( 'admin_notices', [ $this, 'maybeShowDomainChangeNotice' ] );
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
		if ( $option !== $this->registered_webhook ) {
			return;
		}

		// store the old webhook when this changes.
		$this->setPreviousWebhook( $old_value );
	}

	/**
	 * Store the old domain in the database.
	 * We do autoload this option so we can check it on every request.
	 *
	 * @param string $value The old domain.
	 * @return boolean
	 */
	public function setPreviousWebhook( $value ) {
		return update_option( $this->previous_webhook, $value );
	}

	/**
	 * Delete any previous webhooks.
	 *
	 * @return boolean
	 */
	public function deletePreviousWebhook() {
		return delete_option( $this->previous_webhook );
	}

	/**
	 * Get the previous webhook.
	 */
	public function getPreviousWebhook() {
		return get_option( $this->previous_webhook, [] );
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
	 * Save the registered webhook.
	 *
	 * @return bool
	 */
	public function saveRegisteredWebhook( $webhook ) {
		return update_option( $this->registered_webhook, $webhook );
	}

	public function getRegisteredWebhook() {
		return get_option( $this->registered_webhook, [] );
	}

	/**
	 * Does the webhook domain match?
	 *
	 * @return boolean
	 */
	public function domainMatches() {
		$webhook = get_option( $this->registered_webhook, [] );
		if ( empty( $webhook['url'] ) ) {
			return false;
		}
		return Webhook::getListenerUrl() === $webhook['url'];
	}

	/**
	 * Undocumented function
	 *
	 * @return void
	 */
	public function maybeShowDomainChangeNotice() {
		$webhook = $this->getPreviousWebhook();

		if ( empty( $webhook['url'] ) || empty( $webhook['id'] ) ) {
			return false;
		}

		?>
		<div class="notice notice-error">
			<p>
				<?php _e( 'It looks like this site has moved or has been duplicated. CheckoutEngine has created new webhooks for the domain to prevent purchase sync issues. Should we remove the previous webook?', 'checkout_engine' ); ?>
			</p>
			<p>
				<a href="<?php echo esc_url( \CheckoutEngine::getUrl()->editModel( 'ignore_webhook', $webhook['id'] ) ); ?>"
					class="button button-primary"
					aria-label="<?php esc_attr_e( 'Ignore notice.', 'checkout_engine' ); ?>">
				<?php esc_html_e( 'Ignore this notice. This is a duplicate or staging site.', 'checkout_engine' ); ?>
				</a>
				<a href="<?php echo esc_url( \CheckoutEngine::getUrl()->editModel( 'remove_webhook', $webhook['id'] ) ); ?>"
					onclick="return confirm('<?php esc_attr_e( 'Are you sure you want to remove this webhook?', 'checkout_engine' ); ?>')"
					class="button button-secondary"
					aria-label="<?php esc_attr_e( 'Remove webhook', 'checkout_engine' ); ?>">
					<?php printf( esc_html__( 'My website domain has permanently changed. Remove webhook for %s', 'checkout_engine' ), esc_url( str_replace( 'checkout_engine/webhooks', '', untrailingslashit( $webhook['url'] ) ) ) ); ?>
				</a>
			<p>
		</div>

		<?php
		return true;
	}

	/**
	 * Toggle archive action link and text.
	 *
	 * @param \CheckoutEngine\Models\Product $product Product model.
	 * @return string
	 */
	public function actionRemoveWebhook( $webhook ) {
		$confirm_message = __( 'Are you sure you want to remove this webhook?', 'checkout_engine' );
		$link            = \CheckoutEngine::getUrl()->editModel( 'remove_webhook', $webhook->id );
		$text            = sprintf( esc_html__( 'My website domain has permanently changed. Remove webhook for %s', 'checkout_engine' ), esc_url_raw( $webhook->url ) );

		return sprintf(
			'<a class="button button-primary" onclick="return confirm(\'%1s\')" href="%2s" aria-label="%3s">%4s</a>',
			esc_attr( $confirm_message ),
			esc_url( $link ),
			esc_attr__( 'Remove webhook.', 'checkout_engine' ),
			esc_html( $text )
		);
	}
}

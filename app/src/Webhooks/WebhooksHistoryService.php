<?php

namespace CheckoutEngine\Webhooks;

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
	 * Does this webhook have multiple domains registered?
	 *
	 * @return boolean
	 */
	public function getPreviousDomain() {
		$webhook = get_option( $this->registered_webhook, [] );
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
		return get_site_url() === $webhook['url'];
	}

	/**
	 * Undocumented function
	 *
	 * @return void
	 */
	public function maybeShowDomainChangeNotice() {
		$webhook_id  = '123';
		$webhook_url = 'http://foo.com'
		// if we don't have multiple domains, we don't need to show a notice.
		// $previous_webhook = $this->getPreviousDomain();
		// if ( ! $previous_webhook ) {
		// return false;
		// }

		?>
		<div class="notice notice-error">
			<p>
				<?php _e( 'It looks like this site has moved or has been duplicated. CheckoutEngine has created new webhooks for the domain to prevent purchase sync issues. Should we remove the previous webook?', 'checkout_engine' ); ?>
			</p>
			<p>
				<a href="<?php echo esc_url( \CheckoutEngine::getUrl()->editModel( 'remove_domain', $webhook_id ) ); ?>" class="button button-primary">Do nothing. This is a duplicate site like a staging site.</a>
				<a href="<?php echo esc_url( \CheckoutEngine::getUrl()->editModel( 'remove_webhook', $webhook_id ) ); ?>"
					onclick="return confirm('<?php esc_attr_e( 'Are you sure you want to remove this webhook?', 'checkout_engine' ); ?>')"
					class="button button-secondary">
					<?php printf( esc_html__( 'My website domain has permanently changed. Remove webhook for %s', 'checkout_engine' ), esc_url( $webhook_url ) ); ?>
				</a>
			<p>
		</div>

		<?php

		// $class   = 'notice notice-error';
		// $message = __( 'It looks like this site has moved or has been duplicated. CheckoutEngine has created new webhooks for the domain to prevent purchase sync issues. Should we remove the previous webook?', 'checkout_engine' );

		// printf(
		// '<div class="%1$s"><p>%2$s</p><p><a href="%3$s" class="button button-primary">%4$s</a> <a href="%5$s" class="button button-secondary">%6$s</a></div></p>',
		// esc_attr( $class ),
		// wp_kses_post( $message ),
		// '#',
		// esc_html__( 'This is a duplicate site like a staging site.', 'checkout_engine' ),
		// $this->actionRemoveWebhook( 'test' ),
		// translators:: %s is the domain.
		// sprintf( esc_html__( 'My website domain has permanently changed. Remove webhook for %s', 'checkout_engine' ), esc_url_raw( $previous_webhook ) )
		// );

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

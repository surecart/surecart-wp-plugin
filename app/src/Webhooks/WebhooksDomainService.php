<?php

namespace CheckoutEngine\Webhooks;

/**
 * Handles domain name changes to webhook
 * Shows notices and allows user to remove old webhooks.
 */
class WebHooksDomainService {
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
	protected $current_domain = 'ce_webhook_main_domain';

	/**
	 * The old domains option name.
	 *
	 * @var string
	 */
	protected $previous_domain = 'ce_webhook_previous_domain';

	/**
	 * Listen to domain changes.
	 *
	 * @return void
	 */
	public function listen() {
		\add_action( 'updated_option', [ $this, 'maybeStoreDomainChange' ], 10, 3 );
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
	public function maybeStoreDomainChange( $option, $old_value, $value ) {
		// we only care about our option and if it was updated.
		if ( $option !== $this->current_domain ) {
			return;
		}

		// store activated domains in chain.
		$this->setPreviousDomain( $old_value );
	}

	/**
	 * Store the old domain in the database.
	 * We do autoload this option so we can check it on every request.
	 *
	 * @param string $value The old domain.
	 * @return boolean
	 */
	public function setPreviousDomain( $value ) {
		return update_option( $this->previous_domain, $value );
	}

	/**
	 * Does this webhook have multiple domains registered?
	 *
	 * @return boolean
	 */
	public function getPreviousDomain() {
		return get_option( $this->previous_domain, '' );
	}

	/**
	 * Save the domain for the webhooks
	 * Note: we don't autoload this option.
	 *
	 * @return bool
	 */
	public function setDomain() {
		return update_option( $this->current_domain, get_site_url(), false );
	}

	/**
	 * Does the webhook domain match?
	 *
	 * @return boolean
	 */
	public function domainMatches() {
		return get_site_url() === get_option( $this->current_domain, '' );
	}

	/**
	 * Undocumented function
	 *
	 * @return void
	 */
	public function maybeShowDomainChangeNotice() {
		// if we don't have multiple domains, we don't need to show a notice.
		$previous_domain = $this->getPreviousDomain();
		if ( ! $previous_domain ) {
			return false;
		}

		$class   = 'notice notice-error';
		$message = __( 'It looks like this site has moved or has been duplicated. CheckoutEngine has created new webhooks for the domain to prevent purchase sync issues. Should we remove the previous webook?', 'checkout_engine' );

		printf(
			'<div class="%1$s"><p>%2$s</p><a href="#" class="button button-primary">%3$s</a><a href="#" class="button button-secondary">%4$s</a></div>',
			esc_attr( $class ),
			wp_kses_post( $message ),
			esc_html__( 'This is a duplicate site like a staging site.', 'checkout_engine' ),
			// translators:: %s is the domain.
			sprintf( esc_html__( 'My website domain has permanently changed. Remove webhook for %s', 'checkout_engine' ), esc_url_raw( $previous_domain ) )
		);

		return true;
	}
}

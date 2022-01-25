<?php

namespace CheckoutEngine\Models;

use CheckoutEngine\Support\Encryption;

/**
 * Price model
 */
class Webhook extends Model {
	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'webhook_endpoints';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'webhook_endpoint';

	/**
	 * Register webhook for this site
	 *
	 * @return $this|false
	 */
	protected function register() {
		parent::create(
			[
				'description' => 'Main webhook for Checkout Engine',
				'enabled'     => true,
				'url'         => get_site_url( null, '/checkout_engine/webhooks' ),
			]
		);

		// set signing secret on create.
		if ( ! empty( $this->attributes['signing_secret'] ) ) {
			$this->setSigningSecret( $this->attributes['signing_secret'] );
		}

		return $this;
	}

	/**
	 * Get the signing secret stored as encrypted data in the WP database.
	 */
	protected function getSigningSecret() {
		return Encryption::decrypt( get_option( 'ce_webhook_signing_secret' ) );
	}

	/**
	 * Set the signing secret as encrypted data in the WP database.
	 *
	 * @param string $value The secret.
	 */
	protected function setSigningSecret( $value ) {
		return Encryption::encrypt( get_option( 'ce_webhook_signing_secret', $value, false ) );
	}
}

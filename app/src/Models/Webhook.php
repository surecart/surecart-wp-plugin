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
	 * Get the listener url.
	 *
	 * @return string
	 */
	public function getListenerUrl() {
		return get_site_url( null, '/checkout_engine/webhooks', is_ssl() ? 'https' : 'http' );
	}

	/**
	 * Register webhook for this site
	 *
	 * @return $this|false
	 */
	protected function register() {
		return $this->create(
			[
				'description' => 'Main webhook for Checkout Engine',
				'enabled'     => true,
				'url'         => $this->getListenerUrl(),
			]
		);
	}
}

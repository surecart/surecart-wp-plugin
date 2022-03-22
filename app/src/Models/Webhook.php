<?php

namespace SureCart\Models;

use SureCart\Support\Encryption;

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
	protected function getListenerUrl() {
		return get_site_url( null, '/surecart/webhooks', is_ssl() ? 'https' : 'http' );
	}

	/**
	 * Register webhook for this site
	 *
	 * @return $this|false
	 */
	protected function register() {
		$existing = $this->findExisting();

		if ( $existing ) {
			return $existing;
		}

		return $this->create(
			[
				'description' => 'Main webhook for SureCart',
				'enabled'     => true,
				'url'         => $this->getListenerUrl(),
			]
		);
	}

	/**
	 * Find existing webhook with the same listner url.
	 *
	 * @return \SureCart\Models\Webhook|false
	 */
	public function findExisting() {
		$webhooks = $this->setPagination( [ 'per_page' => 100 ] )->get();
		if ( is_array( $webhooks ) && ! empty( $webhooks ) ) {
			foreach ( $webhooks as $webhook ) {
				if ( $webhook['url'] === $this->getListenerUrl() ) {
					return $webhook;
				}
			}
		}
		return false;
	}
}

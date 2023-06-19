<?php

namespace SureCart\Models;

/**
 * Webhook Model.
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
	 * Group name.
	 *
	 * @var string
	 */
	public const GROUP_NAME = 'surecart-webhooks';

	/**
	 * Get the listener url.
	 *
	 * @return string
	 */
	protected function getListenerUrl(): string {
		if ( defined( 'SURECART_RUNNING_TESTS' ) ) {
			return 'http://test.com';
		}

		return get_home_url( null, '/surecart/webhooks', is_ssl() ? 'https' : 'http' );
	}

	/**
	 * Register webhook for this site.
	 *
	 * @return self|boolean
	 */
	protected function register() {
		$existing = $this->findExisting();

		if ( $existing ) {
			return $existing;
		}

		$webhook = $this->create(
			[
				'description' 	 => 'Main webhook for SureCart',
				'enabled'     	 => true,
				'destination' 	 => 'wordpress',
				'url'         	 => $this->getListenerUrl(),
				'webhook_events' => \SureCart::config()->webhook_events,
			]
		);

		if ( ! $webhook || empty ( $webhook->id ) ) {
			return false;
		}

		// Send a test webhook to check if it works.
		$this->sendTestWebhook( $webhook );

		return $webhook;
	}

	/**
	 * Find existing webhook with the same listener url.
	 *
	 * @return \SureCart\Models\Webhook|boolean
	 */
	protected function findExisting() {
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

	/**
	 * Send test webhook.
	 *
	 * @param Webhook $webhook
	 *
	 * @return void
	 */
	private function sendTestWebhook( Webhook $webhook ) {
		try {
			$this->makeRequest(
				[
					'method' => 'POST',
					'query'  => [],
				],
				$this->endpoint . '/' . $webhook->id . '/test',
			);
		} catch ( \Exception $exception ) {
			// SKIP.
		}
	}
}

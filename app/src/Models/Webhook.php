<?php

namespace SureCart\Models;

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
		return get_home_url( null, '/surecart/webhooks', is_ssl() ? 'https' : 'http' );
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

		// Send a test webhook to queue to check if it works.
		$this->addTestWebhookToQueue( $webhook );

		return $webhook;
	}

	/**
	 * Find existing webhook with the same listener url.
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

	/**
	 * Add test webhook to queue.
	 *
	 * @param Webhook $webhook
	 *
	 * @return void
	 */
	private function addTestWebhookToQueue( Webhook $webhook ) {
		\SureCart::queue()->add(
			'surecart/send-test-webhook',
			[
				'webhook_id' => $webhook->id,
			],
			self::GROUP_NAME
		);
	}

	/**
	 * Send test webhook to the endpoint.
	 *
	 * @param string $webhook_id
	 *
	 * @return void
	 */
	public function sendTestWebhook( string $webhook_id ) {
		try {
			$this->makeRequest(
				[
					'method' => 'POST',
					'query'  => [],
				],
				$this->endpoint . '/' . $webhook_id . '/test',
			);
		} catch ( \Exception $exception ) {
			// Do nothing.
		}
	}
}
